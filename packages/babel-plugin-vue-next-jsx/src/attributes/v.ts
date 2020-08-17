import { DirectiveNode, JsxNode } from '../jsxNode';
import { hyphenate, NodeTypes } from '../util/constant';
import { resolveDirective } from '../util/resolveDirective';

// transform vXx to v-Xx
export default (name: string, value: any, index: number, jsxNode: JsxNode) => {
  const directiveNode: DirectiveNode = {
    type: NodeTypes.DIRECTIVE,
    name: resolveDirective(hyphenate(name)),
    exp: value,
    index
  };
  jsxNode.directives.push(directiveNode);
}
