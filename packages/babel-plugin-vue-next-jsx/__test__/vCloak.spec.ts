import { compare, transformWithPlugin, vueCompiled } from './util';

describe('compiler: v-cloak', () => {
  test('should transform into object', () => {
    const code = '<div v-cloak/>'
    compare(code)
  })
})
