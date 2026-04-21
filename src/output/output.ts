import { ElementType } from '../types.js'

const OrderedLevels = ['regex', 'typo', 'disposable', 'mx', 'smtp'] as const

export type SubOutputFormat = {
  valid: boolean
  reason?: string | undefined
}

type Level = ElementType<typeof OrderedLevels>

export interface GeneralOutputFormat extends SubOutputFormat {
  reason?: Level | undefined
}

export type OutputFormat = GeneralOutputFormat & {
  validators: {
    [K in Level]?: SubOutputFormat
  }
}

export const createOutput = (failLevel?: Level, failReason?: string): OutputFormat => {
  const out: OutputFormat = { valid: true, validators: {} }
  if (failLevel) {
    out.reason = failLevel
    out.valid = false
  }
  let valid = true
  for (const level of OrderedLevels) {
    const levelOut: SubOutputFormat = { valid }
    if (level === failLevel) {
      valid = false
      levelOut.valid = false
      levelOut.reason = failReason
    }
    out.validators[level] = levelOut
  }
  return out
}
