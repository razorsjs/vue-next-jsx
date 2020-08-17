import { AttributeNode, DirectiveNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '../util/constant';
import { resolveDirective } from '../util/resolveDirective';

// Treat v-xx as directive
// All directives will be resolved as a_b: they are often registered global, and functional comp doesn't need.
export default (name: string, value: any, index:number, jsxNode: JsxNode) => {
  const directiveNode: DirectiveNode = {
    type: NodeTypes.DIRECTIVE,
    name: resolveDirective(name),
    exp: value,
    index
  };
  jsxNode.directives.push(directiveNode);
}
