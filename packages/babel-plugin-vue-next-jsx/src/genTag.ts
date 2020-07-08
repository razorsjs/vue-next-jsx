/**
 * gen tag from path
 */

import { NodePath, types as t } from '@babel/core'
import jsxNode from './jsxNode';

export default function() {
  const { path, options: {isNativeTag} } = jsxNode
  const openingElementPath: NodePath<t.JSXOpeningElement> = path.get('openingElement')
  const nameNode = openingElementPath.node.name

  if (t.isJSXIdentifier(nameNode)) {
    const name = nameNode.name
    if (path.scope.hasBinding(name) && !isNativeTag(name)) {
      // as component
      jsxNode.tag = t.identifier(name)
      return
    } else {
      // as dom tag
      jsxNode.tag = t.stringLiteral(name)
      return
    }
  }

  if (t.isJSXMemberExpression(nameNode)) {
    // TODO: transformJSXMemberExpression
    // return transformJSXMemberExpression(t, namePath)
    return
  }

  throw new Error(`getTag: ${nameNode.type} is not supported`)
}
