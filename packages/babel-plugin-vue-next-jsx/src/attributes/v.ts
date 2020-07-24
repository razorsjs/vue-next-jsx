import { DirectiveNode, JsxNode } from '../jsxNode';
import { hyphenate, NodeTypes } from '../util/constant';

// transform vXx to v-Xx
export default (name: string, value: any, index: number, jsxNode: JsxNode) => {
  const directiveNode: DirectiveNode = {
    type: NodeTypes.DIRECTIVE,
    name: hyphenate(name).split('-')[1],
    exp: value,
    index
  };
  jsxNode.directives.push(directiveNode);
}
