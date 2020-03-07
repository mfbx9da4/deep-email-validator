import isEmail from 'validator/lib/isEmail'
import { OutputFormat, createOutput } from './output/output'
import { checkTypo } from './typo/typo'
import { getBestMx } from './dns/dns'
import { checkSMTP } from './smtp/smtp'
import { checkDisposable } from './disposable/disposable'

declare global {
  interface ObjectConstructor {
    typedKeys<T>(o: T): Array<keyof T>
  }
}
Object.typedKeys = Object.keys as any

export async function validate(
  recipient: string,
  sender: string = 'name@example.org'
): Promise<OutputFormat> {
  if (!isEmail(recipient)) return createOutput('regex')

  const typoResponse = await checkTypo(recipient)
  if (typoResponse) return createOutput('typo', typoResponse)

  const domain = recipient.split('@')[1]

  const disposableResponse = await checkDisposable(domain)
  if (disposableResponse) return createOutput('disposable', disposableResponse)

  const mx = await getBestMx(domain)
  if (!mx) return createOutput('mx', 'MX record not found')

  return checkSMTP(sender, recipient, mx.exchange)
}

async function main() {
  if (process.argv[2]) {
    const res = await validate(process.argv[2])
    console.log(JSON.stringify(res, null, 2))
  }
}
main()
