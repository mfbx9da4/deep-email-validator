import { ElementType } from '../types'

const OrderedLevels = ['regex', 'typo', 'disposable', 'mx', 'smtp'] as const

export type SubOutputFormat = {
  valid: boolean
  reason?: string
}

const NullOutputFormat: OutputFormat = {
  valid: true,
  validators: {
    regex: { valid: true },
    typo: { valid: true },
    disposable: { valid: true },
    mx: { valid: true },
    smtp: { valid: true },
  },
}
type Level = ElementType<typeof OrderedLevels>
export type OutputFormat = SubOutputFormat & {
  validators: {
    [K in Level]: SubOutputFormat
  }
}

export const createOutput = (
  failLevel?: Level,
  failReason?: string
): OutputFormat => {
  const out = NullOutputFormat
  let valid = true
  for (let i = 0; i < OrderedLevels.length; i++) {
    const level = OrderedLevels[i]
    let reason
    if (level === failLevel) {
      valid = false
      out.valid = valid
      reason = failReason
      out.reason = failLevel
    }
    out.validators[level] = { valid: valid, reason }
  }
  return out
}
