export const isEmail = (email: string): string | undefined => {
  email = (email || '').trim()
  if (email.length === 0) {
    return 'Email not provided'
  }
  const split = email.split('@')
  if (split.length < 2) {
    return 'Email does not contain "@".'
  } else {
    const [domain] = split.slice(-1)
    if (domain.indexOf('.') === -1) {
      return 'Must contain a "." after the "@".'
    }
  }
}
