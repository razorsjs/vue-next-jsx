import {types as t} from '@babel/core'
import { DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '@vue/compiler-core';
import { getContent } from '../util';
import {capitalize} from '../util/constant'
import { isStaticExp, resolveModifierValue } from '../util/resolveModifiers';

export default (dir: DirectiveNode, node: JsxNode): void => {
  // we do nothing in dir.name, just v-on or vOn, and move all logic in value
  // https://github.com/vuejs/jsx/issues/141#issuecomment-656648284
  // Implements for @bjarkihall's design
  // 2 parameters (name, value)
  // 3 parameters (name, value, modifiers)
  const {exp} = dir
  let value, name, modifiers
  if(t.isArrayExpression(exp)) {
    const {elements} = exp
    if(elements.length < 2) {
      throw new Error('v-on must have at least two params for [name,value], and we recommend using onXXX instead of v-on')
    }
    name = elements[0]
    value = elements[1]
    modifiers = elements[2]
  }
  if(isStaticExp(name)) name = `on${capitalize(name)}`
  const {key, value: _value} = resolveModifierValue(name, value, modifiers)
  name = key
  value = _value
  node.attributes.push({
    type: NodeTypes.ATTRIBUTE,
    name,
    value
  })
}
