import isEmail from 'validator/lib/isEmail'
import { OutputFormat, createOutput } from './output/output'
import { checkTypo } from './typo/typo'
import { getBestMx } from './dns/dns'
import { checkSMTP } from './smtp/smtp'
import { checkDisposable } from './disposable/disposable'
import './types'

const defaultOptions = {
  email: 'name@example.org',
  sender: 'name@example.org',
  validateRegex: true,
  validateMx: true,
  validateTypo: true,
  validateDisposable: true,
  validateSMTP: true,
}

type ValidatorOptions = {
  email: string
  sender?: string
  validateRegex?: boolean
  validateMx?: boolean
  validateTypo?: boolean
  validateDisposable?: boolean
  validateSMTP?: boolean
}

type ValidatorOptionsFinal = {
  email: string
  sender: string
  validateRegex: boolean
  validateMx: boolean
  validateTypo: boolean
  validateDisposable: boolean
  validateSMTP: boolean
}

export async function validate(
  emailOrOptions: string | ValidatorOptions
): Promise<OutputFormat> {
  let email: string
  let options: ValidatorOptionsFinal = defaultOptions
  if (typeof emailOrOptions === 'string') {
    email = emailOrOptions
  } else {
    email = emailOrOptions.email
    options = { ...options, ...emailOrOptions }
  }

  if (options.validateRegex && !isEmail(email))
    return createOutput('regex', 'Invalid regex')

  if (options.validateTypo) {
    const typoResponse = await checkTypo(email)
    if (typoResponse) return createOutput('typo', typoResponse)
  }

  const domain = email.split('@')[1]

  if (options.validateDisposable) {
    const disposableResponse = await checkDisposable(domain)
    if (disposableResponse)
      return createOutput('disposable', disposableResponse)
  }

  if (options.validateMx) {
    const mx = await getBestMx(domain)
    if (!mx) return createOutput('mx', 'MX record not found')
    if (options.validateSMTP) {
      return checkSMTP(options.sender, email, mx.exchange)
    }
  }

  return createOutput()
}

async function main() {
  if (process.argv[2]) {
    const res = await validate(process.argv[2])
    console.log(JSON.stringify(res, null, 2))
  }
}
main()

export default validate
