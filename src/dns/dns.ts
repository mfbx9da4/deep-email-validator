import dns from 'dns'

export const getMx = async (domain: string): Promise<dns.MxRecord[]> => {
  return new Promise(r =>
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses) return r([] as dns.MxRecord[])
      r(addresses)
    })
  )
}

export const getBestMx = async (domain: string): Promise<dns.MxRecord | undefined> => {
  const addresses = await getMx(domain)
  let bestIndex = 0

  for (let i = 0; i < addresses.length; i++) {
    if (addresses[i].priority < addresses[bestIndex].priority) {
      bestIndex = i
    }
  }

  return addresses[bestIndex]
}
