import mailCheck from 'mailcheck'

type TypoSuggestion = {
  address: string
  domain: string
  full: string
}

export const checkTypo = async (email: string): Promise<string | undefined> =>
  new Promise(r =>
    mailCheck.run({
      email,
      suggested: (suggestion: TypoSuggestion) => {
        r(`Likely typo, suggested email: ${suggestion.full}`)
      },
      empty: function() {
        r()
      },
    })
  )
