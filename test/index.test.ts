import values from 'lodash/values'
import every from 'lodash/every'
import { validate } from '../src/index'

import { isEmail } from '../src/regex/regex'

const elevenSeconds = 11 * 1000

describe('security: multiple @ signs', () => {
  it('rejects email with multiple @ signs via regex', () => {
    expect(isEmail('me@gmail.com@bad.com')).toBe('Email must contain exactly one "@".')
  })

  it('rejects email with multiple @ signs via validate', async () => {
    const res = await validate('me@gmail.com@bad.com')
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('regex')
  })

  it('rejects angle-addr style input', async () => {
    const res = await validate('me@gmail.com@<me@bad.com>')
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('regex')
  })

  it('rejects email with multiple @ even when regex validation is disabled', async () => {
    const res = await validate({
      email: 'me@gmail.com@bad.com',
      validateRegex: false,
    })
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('regex')
  })
})

describe('security: regex edge cases', () => {
  it('rejects empty local part', () => {
    expect(isEmail('@gmail.com')).toBe('Missing local part before "@".')
  })

  it('rejects empty domain', () => {
    expect(isEmail('user@')).toBe('Must contain a "." after the "@".')
  })

  it('rejects empty string', () => {
    expect(isEmail('')).toBe('Email not provided')
  })

  it('rejects email without @', () => {
    expect(isEmail('usergmail.com')).toBe('Email does not contain "@".')
  })
})

describe('validation tests', () => {
  it('fails without sending data', async () => {
    const res = await validate({
      email: 'jubao@le.com',
      sender: 'jubao@le.com',
      validateTypo: false,
      validateDisposable: false,
    })
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('smtp')
    expect(res.validators.smtp?.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })
  it('fails with bad regex', async () => {
    const res = await validate('david.gmail.com')
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('regex')
    expect(res.validators.regex?.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it('fails later with malformed regex', async () => {
    const res = await validate({
      email: 'dav id@gmail.com',
      validateRegex: false,
    })
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('smtp')
    expect(res.validators.regex?.valid).toBe(true)
    expect(res.validators.smtp?.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it('fails with common typo', async () => {
    const res = await validate('david@gmaill.com')
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('typo')
    expect(res.validators.typo?.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it('fails with disposable email', async () => {
    const res = await validate('david@temp-mail.org')
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('disposable')
    expect(res.validators.disposable?.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it(
    'fails with bad dns',
    async () => {
      const res = await validate('xxx@yyy.zzz')
      expect(res.valid).toBe(false)
      expect(res.reason).toBe('mx')
      expect(res.validators.mx?.valid).toBe(false)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )

  it('fails with bad mailbox', async () => {
    const res = await validate('david@andco.life')
    expect(res.valid).toBe(false)
    expect(res.reason).toBe('smtp')
    expect(res.validators.smtp?.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it(
    'passes when we skip smtp validation',
    async () => {
      const res = await validate({
        email: 'david@andco.life',
        validateSMTP: false,
      })
      expect(res.valid).toBe(true)
      expect(every(values(res.validators), x => x && x.valid)).toBe(true)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )

  it(
    'passes when valid special char',
    async () => {
      const res = await validate('~@oftn.org')
      expect(res.valid).toBe(true)
      expect(every(values(res.validators), x => x && x.valid)).toBe(true)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )

  it(
    'passes when valid wildcard',
    async () => {
      const res = await validate('test@google.com')
      expect(res.valid).toBe(true)
      expect(every(values(res.validators), x => x && x.valid)).toBe(true)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )

  it(
    'passes with custom TLD',
    async () => {
      const res = await validate({
        email: 'info@utob.ir',
        validateSMTP: false,
        additionalTopLevelDomains: ['ir'],
      })
      expect(res.valid).toBe(true)
      expect(every(values(res.validators), x => x && x.valid)).toBe(true)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )
})
