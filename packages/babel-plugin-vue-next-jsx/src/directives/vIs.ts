import { DirectiveNode, JsxNode } from '../jsxNode';
import { types as t } from '@babel/core';
import { ElementTypes } from '@vue/compiler-core';
import { addVueImport } from '../addVueImport';
import { RESOLVE_DYNAMIC_COMPONENT } from '../util/constant';
import { getContent } from '../util';

/**
 * v-is is equal with <component :is=></component>
 * v-is is COMPONENT
 */

export const transformVIs = (node: JsxNode, exp) => {
  node.tagType = ElementTypes.COMPONENT
  // change node.tag
  const _name = t.identifier(addVueImport(RESOLVE_DYNAMIC_COMPONENT))
  if(!t.isLiteral(exp)) {
    exp = t.identifier(getContent(exp))
  }
  node.tag = t.callExpression(_name, [exp])
}

export default (dir: DirectiveNode, node: JsxNode): void => {
  transformVIs(node, dir.exp)
}
