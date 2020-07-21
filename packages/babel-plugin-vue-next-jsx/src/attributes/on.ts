import { AttributeNode, DirectiveNode, JsxNode } from '../jsxNode';
import { hyphenate, NodeTypes, V_ON_WITH_MODIFIERS } from '../util/constant';
import {types as t} from '@babel/core'
import { addVueImport } from '../addVueImport';
import { resolveModifierValue } from '../util/resolveModifiers';

// onXxx
export default (name: string | t.Expression, value: any, jsxNode: JsxNode) => {
  // value can be array [value, modifiers]
  if(t.isArrayExpression(value)) {
    const {key, value: _value} = resolveModifierValue(name, value.elements[0], (value as any).elements[1])
    name = key
    value = _value
  }
  const attributeNode: AttributeNode = {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
  };
  jsxNode.attributes.push(attributeNode);
}
