import { isEmail } from './regex/regex.js'
import { checkTypo } from './typo/typo.js'
import { getBestMx } from './dns/dns.js'
import { checkSMTP } from './smtp/smtp.js'
import { checkDisposable } from './disposable/disposable.js'
import { getOptions, ValidatorOptions } from './options/options.js'
import { OutputFormat, createOutput } from './output/output.js'
import './types.js'

export async function validate(emailOrOptions: string | ValidatorOptions): Promise<OutputFormat> {
  const options = getOptions(emailOrOptions)
  const email = options.email

  if (options.validateRegex) {
    const regexResponse = isEmail(email)
    if (regexResponse) return createOutput('regex', regexResponse)
  }

  if (options.validateTypo) {
    const typoResponse = await checkTypo(email, options.additionalTopLevelDomains)
    if (typoResponse) return createOutput('typo', typoResponse)
  }

  const emailParts = email.split('@')
  if (emailParts.length !== 2) {
    return createOutput('regex', 'Email must contain exactly one "@".')
  }
  const domain = emailParts[1]
  if (!domain) {
    return createOutput('regex', 'Missing domain after "@".')
  }

  if (options.validateDisposable) {
    const disposableResponse = checkDisposable(domain)
    if (disposableResponse) return createOutput('disposable', disposableResponse)
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

export default validate
