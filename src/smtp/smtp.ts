import net from 'net'
import { OutputFormat, createOutput } from '../output/output'
import { hasCode, ErrorCodes } from './errorCodes'

export const checkSMTP = async (
  sender: string,
  recipient: string,
  exchange: string
): Promise<OutputFormat> => {
  const timeout = 1000 * 10 // 10 seconds
  return new Promise(r => {
    const socket = net.createConnection(25, exchange)
    socket.setEncoding('ascii')
    socket.setTimeout(timeout)
    socket.on('error', error => {
      console.log('error', error)
      socket.emit('fail', error)
    })

    socket.on('fail', msg => {
      r(createOutput('smtp', msg))
      socket.write(`quit\r\n`)
      socket.end()
      socket.destroy()
    })

    socket.on('success', () => {
      r(createOutput())
      socket.write(`quit\r\n`)
      socket.end()
      socket.destroy()
    })

    const commands = [
      `helo ${exchange}\r\n`,
      `mail from: <${sender}>\r\n`,
      `rcpt to: <${recipient}>\r\n`,
    ]
    let i = 0
    socket.on('next', () => {
      if (i < 3) {
        socket.write(commands[i++])
      } else {
        socket.emit('success')
      }
    })

    socket.on('timeout', () => {
      socket.emit('fail', 'Timeout')
    })

    socket.on('connect', () => {
      socket.on('data', msg => {
        console.log('data', msg)
        if (hasCode(msg, 220) || hasCode(msg, 250)) {
          socket.emit('next', msg)
        } else if (hasCode(msg, 550)) {
          socket.emit('fail', 'Invalid Mailbox')
        } else {
          const [code] = Object.typedKeys(ErrorCodes).filter(x =>
            hasCode(msg, x)
          )
          socket.emit('fail', ErrorCodes[code] || 'Unrecognized response')
        }
      })
    })
  })
}
