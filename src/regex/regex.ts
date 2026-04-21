export const isEmail = (email: string): string | undefined => {
  email = (email || '').trim()
  if (email.length === 0) {
    return 'Email not provided'
  }
  const split = email.split('@')
  if (split.length < 2) {
    return 'Email does not contain "@".'
  }
  if (split.length > 2) {
    return 'Email must contain exactly one "@".'
  }
  const local = split[0]
  const domain = split[1]
  if (!local || local.length === 0) {
    return 'Missing local part before "@".'
  }
  if (!domain || domain.length === 0) {
    return 'Missing domain after "@".'
  }
  if (domain.indexOf('.') === -1) {
    return 'Must contain a "." after the "@".'
  }
  return undefined
}
