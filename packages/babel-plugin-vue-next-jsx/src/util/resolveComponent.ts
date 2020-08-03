/**
 * Strategy：
 * 1.Find if component is imported, aa-bb's tag will match specifiers like aabb aaBb AaBb, and ab match ab
 * 2.If is imported, do nothing
 * 3.Not imported(global), fall back to vue's resolveAsset strategy
 */
import {types as t} from '@babel/core'
import {
  RESOLVE_COMPONENT,
  RESOLVE_DIRECTIVE,
  capitalize
} from './constant'

import jsxNode, {importCollection} from '../jsxNode';
import { addVueImport } from '../addVueImport';
import { addVariable } from '../addVariable';

export function resolveComponent(tag: string): t.Identifier {
  let matches = {}
  const prefix = '_component_'
  if(tag.includes('-')) {
    // aabb aaBb AaBb
    const names = tag.split('-')
    const lowerCase = names.map(i=>i.toLowerCase()).join('')
    const camelCase = names[0] + names.slice(1).map(i=>capitalize(i)).join('')
    matches[lowerCase] = true
    matches[camelCase] = true
    matches[capitalize(camelCase)] = true
  } else {
    matches[tag] = true
  }
  const name = importCollection.find((i) => matches[i])
  if(name) {
    return t.identifier(name)
  } else {
    // vue fallback
    const variableName = prefix + tag.replace('-', '_')
    const declarator = t.variableDeclarator(
      t.identifier(variableName),
      t.callExpression(
        t.identifier(addVueImport(RESOLVE_COMPONENT)), [t.stringLiteral(tag)])
    )
    addVariable(declarator, variableName)
    return t.identifier(variableName)
  }
}
