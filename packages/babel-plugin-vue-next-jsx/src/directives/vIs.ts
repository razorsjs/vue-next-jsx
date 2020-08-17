import { DirectiveNode, JsxNode } from '../jsxNode';
import { types as t } from '@babel/core';
import { ElementTypes } from '@vue/compiler-core';
import { addVueImport } from '../addVueImport';
import { hyphenate, RESOLVE_DYNAMIC_COMPONENT } from '../util/constant';
import { getContent } from '../util';
import jsxNode from '../jsxNode';

/**
 * v-is is equal with <component :is=></component>
 * v-is is COMPONENT
 */

export const transformVIs = (node: JsxNode, exp) => {
  const {tag} = node
  node.tagType = ElementTypes.COMPONENT
  // change node.tag
  const _name = t.identifier(addVueImport(RESOLVE_DYNAMIC_COMPONENT))
  node.tag = t.callExpression(_name, [exp])
  // remove _component_ in component declaration
  if(t.isIdentifier(tag)) {
    const collection = jsxNode.extraExpression.componentVariables.declarations
    const index = collection.findIndex((item)=>{
      return t.isIdentifier(item.id) ? item.id.name === tag.name : false
    })
    if(index !== -1) {
      collection.splice(index, 1)
    }
  }
}

export default (dir: DirectiveNode, node: JsxNode): void => {
  transformVIs(node, dir.exp)
}
