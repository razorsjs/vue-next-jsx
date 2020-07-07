import {compare} from './util'

describe('Base jsx use', () => {
  test('Base jsx', () => {
    const code = '<div>hello world</div>'
    compare(code)
  })
  test('Base jsx with simple tag', () => {
    const code = '<div/>'
    compare(code)
  })
  test('Base jsx with one children', () => {
    const code = '<div><span>hello world</span></div>'
    compare(code)
  })
  test('Base jsx with two children', () => {
    const code = '<div><span>hello world</span><span>hello world</span></div>'
    compare(code)
  })
  test('Base jsx with mutiple children', () => {
    const code = '<div><span>123<span>hello world</span></span></div>'
    compare(code)
  })
})
