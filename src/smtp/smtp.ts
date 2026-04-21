import net from 'node:net'
import { OutputFormat, createOutput } from '../output/output.js'
import { hasCode, ErrorCodes } from './errorCodes.js'

const log = (...args: unknown[]) => {
  if (process.env['DEBUG'] === 'true') {
    console.log(...args)
  }
}

const sanitizeForSMTP = (value: string): string => {
  return value.replace(/[\r\n]/g, '')
}

export const checkSMTP = async (sender: string, recipient: string, exchange: string): Promise<OutputFormat> => {
  const sanitizedSender = sanitizeForSMTP(sender)
  const sanitizedRecipient = sanitizeForSMTP(recipient)
  const sanitizedExchange = sanitizeForSMTP(exchange)
  const timeout = 1000 * 10 // 10 seconds
  return new Promise(r => {
    let receivedData = false
    let closed = false
    const socket = net.createConnection(25, exchange)
    socket.setEncoding('ascii')
    socket.setTimeout(timeout)
    socket.on('error', (error: Error) => {
      log('error', error)
      socket.emit('fail', error)
    })
    socket.on('close', (hadError: boolean) => {
      if (!receivedData && !hadError) {
        socket.emit('fail', 'Mail server closed connection without sending any data.')
      }
      if (!closed) {
        socket.emit('fail', 'Mail server closed connection unexpectedly.')
      }
    })
    socket.once('fail', (msg: unknown) => {
      closed = true
      r(createOutput('smtp', String(msg)))
      if (socket.writable && !socket.destroyed) {
        socket.write(`quit\r\n`)
        socket.end()
        socket.destroy()
      }
    })

    socket.on('success', () => {
      closed = true
      if (socket.writable && !socket.destroyed) {
        socket.write(`quit\r\n`)
        socket.end()
        socket.destroy()
      }
      r(createOutput())
    })

    const commands = [`helo ${sanitizedExchange}\r\n`, `mail from: <${sanitizedSender}>\r\n`, `rcpt to: <${sanitizedRecipient}>\r\n`]
    let i = 0
    socket.on('next', () => {
      if (i < 3) {
        const cmd = commands[i++]
        if (socket.writable && cmd) {
          socket.write(cmd)
        } else if (!socket.writable) {
          socket.emit('fail', 'SMTP communication unexpectedly closed.')
        }
      } else {
        socket.emit('success')
      }
    })

    socket.on('timeout', () => {
      socket.emit('fail', 'Timeout')
    })

    socket.on('connect', () => {
      socket.on('data', (msg: string) => {
        receivedData = true
        log('data', msg)
        if (hasCode(msg, 220) || hasCode(msg, 250)) {
          socket.emit('next', msg)
        } else if (hasCode(msg, 550)) {
          socket.emit('fail', 'Mailbox not found.')
        } else {
          const code = Object.typedKeys(ErrorCodes).find(x => hasCode(msg, x))
          socket.emit('fail', code ? ErrorCodes[code] : 'Unrecognized SMTP response.')
        }
      })
    })
  })
}
