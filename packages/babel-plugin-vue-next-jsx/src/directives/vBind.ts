/**
 * v-bind is just an alias used for dynamic key bind
 */
import { DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '@vue/compiler-core';

export default (dir: DirectiveNode, node: JsxNode): void => {
  let {exp, arg} = dir
  node.attributes.push({
    type: NodeTypes.ATTRIBUTE,
    name: arg,
    value: exp
  })
}

