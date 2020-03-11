import axios from 'axios'
import { readFileSync } from 'fs'

const filename = 'disposable_email_blocklist.conf'

let disposableDomains: Set<string> = new Set()

const readDomainsFromFile = () => {
  const text = readFileSync(`./data/${filename}`)
  disposableDomains = new Set(text.toString().split('\n'))
}

const readDomainsFromNetwork = async () => {
  const baseURL =
    'https://raw.githubusercontent.com/martenson/disposable-email-domains/master/'
  const response = await axios.get(`${baseURL}${filename}`)
  disposableDomains = new Set(response.data.split('\n'))
}

const loadDisposableDomains = async () => {
  try {
    await readDomainsFromNetwork()
  } catch (e) {
    try {
      readDomainsFromFile()
    } catch (e) {
      console.warn('Unable to load disposable email domains', e)
    }
  }
}

export const checkDisposable = async (
  domain: string
): Promise<string | undefined> => {
  if (disposableDomains.size === 0) await loadDisposableDomains()
  if (disposableDomains.has(domain))
    return 'Email was created using a disposable email service'
}
