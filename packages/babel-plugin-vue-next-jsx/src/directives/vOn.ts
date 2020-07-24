import {types as t} from '@babel/core'
import { DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '@vue/compiler-core';
import { getContent } from '../util';
import { CAPITALIZE, capitalize } from '../util/constant';
import { isStaticExp, resolveModifierValue } from '../util/resolveModifiers';
import { addVueImport } from '../addVueImport';

export default (dir: DirectiveNode, node: JsxNode): void => {
  let {exp, modifiers, arg, index} = dir
  if(isStaticExp(arg)) {
    arg = `on${capitalize(arg)}`
  } else {
    arg = t.binaryExpression('+', t.stringLiteral('on'), t.callExpression(t.identifier(addVueImport(CAPITALIZE)), [arg]))
  }

  const {key, value} = resolveModifierValue(arg, exp, modifiers)
  node.attributes.push({
    type: NodeTypes.ATTRIBUTE,
    name: key,
    value,
    index
  })
}
