import { AttributeNode, DirectiveNode, JsxNode } from '../jsxNode';
import { hyphenate, NodeTypes, V_ON_WITH_MODIFIERS } from '../util/constant';
import {types as t} from '@babel/core'
import { addVueImport } from '../addVueImport';

// onXxx
export default (name: string, value: any, jsxNode: JsxNode) => {
  // value can be array [value, modifiers]
  if(t.isArrayExpression(value)) {
    value = t.callExpression(t.identifier(addVueImport(V_ON_WITH_MODIFIERS)), value.elements)
  }
  const attributeNode: AttributeNode = {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
  };
  jsxNode.attributes.push(attributeNode);
}
