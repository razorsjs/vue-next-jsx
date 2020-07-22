import { AttributeNode, JsxNode } from '../jsxNode';
import { NodeTypes,parseStringStyle } from '../util/constant';
import {types as t} from '@babel/core'
import {buildPlainObjectToExpression} from '../util/build';
import { isDynamic } from '../util';

// transform style string to object
export default (name: string, value: any, jsxNode: JsxNode) => {
  let isStatic = false
  if(!isDynamic(value)) {
    isStatic = true
  }
  if(t.isStringLiteral(value)) {
    const styleObj = parseStringStyle(value.value)
    value = buildPlainObjectToExpression(styleObj)
    isStatic = true
  }
  const attributeNode: AttributeNode = {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
    static: isStatic
  };
  jsxNode.attributes.push(attributeNode);
}
