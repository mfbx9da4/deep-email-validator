import dns from 'dns'

export const getMx = async (domain: string): Promise<dns.MxRecord[]> => {
  return new Promise(r =>
    dns.resolveMx(domain, (err, addresses) => {
      if (err || !addresses) return r([] as dns.MxRecord[])
      r(addresses)
    })
  )
}

export const getBestMx = async (
  domain: string
): Promise<dns.MxRecord | undefined> => {
  const addresses = await getMx(domain)
  return addresses[0]
}
