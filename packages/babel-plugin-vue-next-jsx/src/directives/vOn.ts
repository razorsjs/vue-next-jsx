import {types as t} from '@babel/core'
import { DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '@vue/compiler-core';
import { getContent } from '../util';
import {capitalize} from '../util/constant'
import { isStaticExp, resolveModifierValue } from '../util/resolveModifiers';

export default (dir: DirectiveNode, node: JsxNode): void => {
  let {exp, modifiers, arg} = dir
  if(isStaticExp(arg)) arg = `on${capitalize(arg)}`
  const {key, value} = resolveModifierValue(arg, exp, modifiers)
  node.attributes.push({
    type: NodeTypes.ATTRIBUTE,
    name: key,
    value
  })
}
