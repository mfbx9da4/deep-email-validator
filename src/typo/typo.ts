import mailCheck from 'mailcheck'

type TypoSuggestion = {
  address: string
  domain: string
  full: string
}

export const checkTypo = async (email: string, additionalTLDs?: string[]): Promise<string | undefined> =>
  new Promise(r => {
    let topLevelDomains = undefined
    if (additionalTLDs && additionalTLDs.length > 0) {
      topLevelDomains = [...mailCheck.defaultTopLevelDomains, ...additionalTLDs]
    }
    mailCheck.run({
      email,
      topLevelDomains: topLevelDomains,
      suggested: (suggestion: TypoSuggestion) => {
        r(`Likely typo, suggested email: ${suggestion.full}`)
      },
      empty: function () {
        r(undefined)
      },
    })
  })
