import dns from 'node:dns'

export const getMx = async (domain: string): Promise<dns.MxRecord[]> => {
  return new Promise(r =>
    dns.resolveMx(domain, (err: NodeJS.ErrnoException | null, addresses: dns.MxRecord[] | undefined) => {
      if (err || !addresses) return r([])
      r(addresses)
    })
  )
}

export const getBestMx = async (domain: string): Promise<dns.MxRecord | undefined> => {
  const addresses = await getMx(domain)
  if (addresses.length === 0) return undefined
  let bestIndex = 0

  for (let i = 0; i < addresses.length; i++) {
    const current = addresses[i]
    const best = addresses[bestIndex]
    if (current && best && current.priority < best.priority) {
      bestIndex = i
    }
  }

  return addresses[bestIndex]
}
