import { DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '@vue/compiler-core';
import {types as t} from '@babel/core';
import { getContent, isDynamic } from '../util';

export default (dir: DirectiveNode, node: JsxNode): void => {
  const {exp} = dir
  node.attributes.push({
    type: NodeTypes.ATTRIBUTE,
    name: 'textContent',
    value: t.identifier(getContent(exp))
  })
  if(isDynamic(exp)) {
    node.dynamicProps.push('textContent')
  }
}
