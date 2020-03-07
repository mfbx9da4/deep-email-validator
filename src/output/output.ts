export type ValidatorOutput = {
  valid: boolean
  reason?: string
}

const NullOutputFormat = {
  valid: true,
  validators: {
    regex: { valid: true } as ValidatorOutput,
    typo: { valid: true } as ValidatorOutput,
    disposable: { valid: true } as ValidatorOutput,
    mx: { valid: true } as ValidatorOutput,
    dns: { valid: true } as ValidatorOutput,
    smtp: { valid: true } as ValidatorOutput,
  },
}

export type OutputFormat = typeof NullOutputFormat

type Levels = keyof OutputFormat['validators']

export const createOutput = (
  failLevel?: Levels,
  failReason?: string
): OutputFormat => {
  const levels = Object.typedKeys(NullOutputFormat.validators)
  const out: OutputFormat = NullOutputFormat
  for (let i = 0; i < levels.length; i++) {
    const level = levels[i]
    let reason
    if (level === failLevel) {
      out.valid = false
      reason = failReason
    }
    out.validators[level] = { valid: out.valid, reason }
  }
  return out
}
