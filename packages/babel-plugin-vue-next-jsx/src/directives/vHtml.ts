import { DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '@vue/compiler-core';

export default (dir: DirectiveNode, node: JsxNode): void => {
  node.attributes.push({
    type: NodeTypes.ATTRIBUTE,
    name: 'innerHTML',
    value: dir.exp,
    index: dir.index
  })
}
