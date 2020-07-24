import { AttributeNode, DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '../util/constant';

// :is in component
export default (name: string, value: any, index: number, jsxNode: JsxNode) => {
  if (jsxNode.vnodeTag === 'component') {
    const directiveNode: DirectiveNode = {
      type: NodeTypes.DIRECTIVE,
      name: 'is',
      exp: value,
      index
    };
    jsxNode.directives.push(directiveNode);
  } else {
    const attributeNode: AttributeNode = {
      type: NodeTypes.ATTRIBUTE,
      name,
      value,
      index
    };
    jsxNode.attributes.push(attributeNode);
  }
}
