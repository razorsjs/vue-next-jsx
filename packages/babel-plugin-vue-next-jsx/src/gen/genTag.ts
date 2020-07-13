/**
 * gen tag from path
 */

import { NodePath, types as t } from '@babel/core';
import jsxNode from '../jsxNode';
import { ElementTypes, FRAGMENT, PatchFlags } from '../util/constant';
import { addVueImport } from '../addVueImport';

export default function() {
  const { path, options } = jsxNode
  if(t.isJSXFragment(path.node)) {
    const component = addVueImport(FRAGMENT)
    jsxNode.tag = t.identifier(component)
    jsxNode.tagType = ElementTypes.ELEMENT
    jsxNode.patchFlag|=PatchFlags.STABLE_FRAGMENT
    return;
  }
  const openingElementPath: NodePath<t.JSXOpeningElement> = (path as NodePath<t.JSXElement>).get('openingElement')
  const nameNode = openingElementPath.node.name
  let tagType = ElementTypes.ELEMENT

  if (t.isJSXIdentifier(nameNode)) {
    const tag = nameNode.name
    // parseTag in @vue/compiler-core pares.ts
    if(options.isNativeTag) {
      if (!options.isNativeTag(tag)) tagType = ElementTypes.COMPONENT
    } else if (
      // isCoreComponent(tag) ||
      (options.isBuiltInComponent && options.isBuiltInComponent(tag)) ||
      /^[A-Z]/.test(tag) ||
      tag === 'component') {
      tagType = ElementTypes.COMPONENT
    }

    if(tagType === ElementTypes.COMPONENT) {
      jsxNode.tag = t.identifier(tag)
    } else {
      jsxNode.tag = t.stringLiteral(tag)
    }

    jsxNode.tagType = tagType

    return;
  }

  if (t.isJSXMemberExpression(nameNode)) {
    // TODO: transformJSXMemberExpression
    // return transformJSXMemberExpression(t, namePath)
    return
  }

  throw new Error(`getTag: ${nameNode.type} is not supported`)
}
