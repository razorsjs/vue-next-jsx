import { transform, BabelFileResult } from '@babel/core'
import VueNextJSX from '../index'
// use compiler-dom to test
import { compile } from '@vue/compiler-dom'

// remove funcName() wrap
const removeFunc = (str: string, funcName): string => {
  const s = str.split(funcName)
  if(s.length < 2) return str
  const pre = s[0]
  let last = str.substring(pre.length + funcName.length + 1)
  const stack = ['(']
  let i = 0;
  for(;i<last.length;i++) {
    if(last[i] === '(') {
      stack.push('(')
    }
    if(last[i] === ')') {
      stack.pop()
    }
    if(stack.length === 0) {
      break
    }
  }
  const result = pre + last.substring(0, i) + last.substring(i+1)
  return result.includes(funcName) ? removeFunc(result, funcName) : result
}

const formatVue = (source: string): string => {
  // format
  const match = source
    // trim \n
    .replace(/\n/g, '').
    match(/(return \(_openBlock[\S\s]+)/)
  if(match) {
    const matched = match[0]
    let result = matched
      .substring(8, matched.length - 2)
      // trim blank
      .replace(/\s+/g, '')
      // remove _ctx because jsx does't need
      .replace(/_ctx./g, '')
      // remove comment
      .replace(/\/\*[\S]+\*\//g, '')
      // remove _component_ in component name because we don't need resolveComponent
      .replace(/_component_/g, '')
    // remove _withCtx() in slot
    result = removeFunc(result, '_withCtx')
    return result
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
    // trim ;
    .replace(/;/g, '')
}

export function vueCompiled(source: string): string {
  const compiled = compile(source, {
    mode: 'module',
    prefixIdentifiers: true,
    optimizeBindings: false,
    hoistStatic: false,
    cacheHandlers: false,
    scopeId: null
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
