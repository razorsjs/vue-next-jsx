import { AttributeNode, JsxNode } from '../jsxNode';
import { NodeTypes,parseStringStyle } from '../util/constant';
import {types as t} from '@babel/core'
import {buildPlainObjectToExpression} from '../util/build';

// transform style string to object
export default (name: string, value: any, jsxNode: JsxNode) => {
  if(t.isStringLiteral(value)) {
    const styleObj = parseStringStyle(value.value)
    value = buildPlainObjectToExpression(styleObj)
  }
  const attributeNode: AttributeNode = {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
    static: true
  };
  jsxNode.attributes.push(attributeNode);
}
