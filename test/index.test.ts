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
  // it('fails with bad dns', async () => {
  //   const res = await validate('david@capoeira.london')
  //   expect(res).toMatchSnapshot()
  // })
  it('fails with bad username', async () => {
    const res = await validate('david@andco.life')
    expect(res).toMatchSnapshot()
  })
})
