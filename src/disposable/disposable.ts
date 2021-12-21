import domains from 'disposable-email-domains'
const disposableDomains: Set<string> = new Set(domains)

export const checkDisposable = async (domain: string): Promise<string | undefined> => {
  if (disposableDomains.has(domain)) return 'Email was created using a disposable email service'
}
