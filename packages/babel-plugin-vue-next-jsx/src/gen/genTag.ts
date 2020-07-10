/**
 * gen tag from path
 */

import { NodePath, types as t } from '@babel/core';
import jsxNode from '../jsxNode';
import { ElementTypes } from '../util/constant';

export default function() {
  const { path, options } = jsxNode
  const openingElementPath: NodePath<t.JSXOpeningElement> = path.get('openingElement')
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
