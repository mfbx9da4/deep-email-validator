import { validate } from '../src/index'
import _ from 'lodash'

describe('validation tests', () => {
  it('fails with bad regex', async () => {
    const res = await validate('dav id@gmail.com')
    expect(res).toMatchSnapshot()
  })
  it('fails with common typo', async () => {
    const res = await validate('david@gmaill.com')
    expect(res).toMatchSnapshot()
  })
  it('fails with disposable email', async () => {
    const res = await validate('david@temp-mail.org')
    expect(res).toMatchSnapshot()
  })

  it('fails with bad dns', async () => {
    const res = await validate('david@finance.net')
    expect(res).toMatchSnapshot()
  })

  it('fails with bad mailbox', async () => {
    const res = await validate('david@andco.life')
    expect(res).toMatchSnapshot()
  })
})
