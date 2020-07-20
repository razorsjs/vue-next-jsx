import {types as t} from '@babel/core'
import { DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '@vue/compiler-core';
import { camelizeFirstWord, getContent } from '../util';
import { addVueImport } from '../addVueImport';
import {V_ON_WITH_MODIFIERS} from '../util/constant'

export default (dir: DirectiveNode, node: JsxNode): void => {
  // we do nothing in dir.name, just v-on or vOn, and move all logic in value
  // https://github.com/vuejs/jsx/issues/141#issuecomment-656648284
  // I like @bjarkihall's design
  // 1 parameter (name)
  // 2 parameters (name, value)
  // 3 parameters (name, value, modifiers)
  const {exp} = dir
  let value, argument, modifiers
  if(t.isArrayExpression(exp)) {
    const {elements} = exp
    if(elements.length < 2) {
      throw new Error('v-on must have at least two params for [name,value], and we recommend using onXXX instead it')
    }
    argument = elements[0]
    value = elements[1]
    modifiers = elements[2]
  }
  if(modifiers) {
    value = t.callExpression(t.identifier(addVueImport(V_ON_WITH_MODIFIERS)), [value, modifiers])
  }
  node.attributes.push({
    type: NodeTypes.ATTRIBUTE,
    name: `on${camelizeFirstWord(getContent(argument))}`,
    value
  })
}
