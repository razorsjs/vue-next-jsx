import { AttributeNode, DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '../util/constant';

export default (name: string, value: any, jsxNode: JsxNode) => {
  const directiveNode: DirectiveNode = {
    type: NodeTypes.DIRECTIVE,
    name: name.split('-')[1],
    exp: value,
  };
  jsxNode.directives.push(directiveNode);
}
