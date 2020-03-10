import { validate } from '../src/index'

const elevenSeconds = 11 * 1000

describe('validation tests', () => {
  it('fails with bad regex', async () => {
    const res = await validate('dav id@gmail.com')
    expect(res.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it('fails later with malformed regex', async () => {
    const res = await validate({
      email: 'dav id@gmail.com',
      validateRegex: false,
    })
    expect(res.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it('fails with common typo', async () => {
    const res = await validate('david@gmaill.com')
    expect(res.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it('fails with disposable email', async () => {
    const res = await validate('david@temp-mail.org')
    expect(res.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it(
    'fails with bad dns',
    async () => {
      const res = await validate('xxx@yyy.zzz')
      expect(res.valid).toBe(false)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )

  it('fails with bad mailbox', async () => {
    const res = await validate('david@andco.life')
    expect(res.valid).toBe(false)
    expect(res).toMatchSnapshot()
  })

  it(
    'fails with bad mailbox',
    async () => {
      const res = await validate('admin@github.com')
      expect(res.valid).toBe(false)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )

  it(
    'passes when we skip smtp validation',
    async () => {
      const res = await validate({
        email: 'admin@github.com',
        validateSMTP: false,
      })

      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )

  it(
    'passes when valid special char',
    async () => {
      const res = await validate('~@oftn.org')
      expect(res.valid).toBe(true)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )

  it(
    'passes when valid wildcard',
    async () => {
      const res = await validate('info@davidalbertoadler.com')
      expect(res.valid).toBe(true)
      expect(res).toMatchSnapshot()
    },
    elevenSeconds
  )
})
