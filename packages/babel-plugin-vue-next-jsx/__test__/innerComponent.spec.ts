import { compare, transformWithPlugin, vueCompiled } from './util';

describe('innerComponent', () => {
  test('keep-alive', () => {
    const code = '<KeepAlive><div>1</div></KeepAlive>'
    expect(compare(code))
  })
  test('keep-alive force block', () => {
    const code = '<div><KeepAlive><div>1</div></KeepAlive></div>'
    expect(compare(code))
  })
  test('teleport', () => {
    const code = '<teleport target="#foo">123</teleport>'
    expect(compare(code))
  })
  test('teleport with childrens', () => {
    const code = '<Teleport>123<div>22</div></Teleport>'
    expect(compare(code))
  })
  test('BaseTransition', () => {
    const code = '<BaseTransition><div>1</div></BaseTransition>'
    expect(compare(code))
  })
  test('Transition', () => {
    const code = '<Transition><div>1</div></Transition>'
    expect(compare(code))
  })
  test('TransitionGroup', () => {
    const code = '<TransitionGroup><div>1</div><div>2</div></TransitionGroup>'
    expect(compare(code))
  })
  // don't need in jsx, only for test
  test('Suspense', () => {
    const code = '<Suspense><div>1</div></Suspense>'
    expect(compare(code))
  })
})
