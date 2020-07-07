import { transform, BabelFileResult } from '@babel/core'
import VueNextJSX from '../main'
import { baseCompile } from '@vue/compiler-core'

const formatVue = (source: string): string => {
  // format
  const match = source
    // trim \n
    .replace(/\n/g, '').
    match(/(return \(_openBlock[\S\s]+)/)
  if(match) {
    const matched = match[0]
    return matched
      .substring(8, matched.length - 2)
      // trim blank
      .replace(/\s+/g, '')
      // remove _ctx because jsx does't need
      .replace(/_ctx./g, '')
      // remove comment
      .replace(/\/\*[\S]+\*\//g, '')
  } else {
    throw Error(`format vue complied faile, source: ${source}`)
  }
}

const formatTransformed = (source: string): string => {
  return source
    // delete ; at the end of transformed
    .substring(0, source.length - 1)
    // trim blank
    .replace(/\s+/g, '')
}

export function vueCompiled(source: string): string {
  const compiled = baseCompile(source, {
    mode: 'module',
    prefixIdentifiers: true
  })
  return formatVue(compiled.code)
}

export function compare(source: string) {
  const code = vueCompiled(source)
  const transformed = transformWithPlugin(source)
  expect(transformed).toBe(code)
}

export function transformWithPlugin(source: string, opts= {}): string {
  const {code} = transform(source,{
    plugins: [[VueNextJSX, opts]]
  }) as BabelFileResult
  return formatTransformed(code)
}
