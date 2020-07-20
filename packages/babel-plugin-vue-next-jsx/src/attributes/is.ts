import { AttributeNode, DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '../util/constant';

// :is in component
export default (name: string, value: any, jsxNode: JsxNode) => {
  if (jsxNode.vnodeTag === 'component') {
    const directiveNode: DirectiveNode = {
      type: NodeTypes.DIRECTIVE,
      name: 'is',
      exp: value,
    };
    jsxNode.directives.push(directiveNode);
  } else {
    const attributeNode: AttributeNode = {
      type: NodeTypes.ATTRIBUTE,
      name,
      value,
    };
    jsxNode.attributes.push(attributeNode);
  }
}
