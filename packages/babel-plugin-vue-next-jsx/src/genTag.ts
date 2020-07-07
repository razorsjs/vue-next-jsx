import { NodePath, types as t } from '@babel/core'
import htmlTags from 'html-tags';
import svgTags from 'svg-tags';

export type Tag = t.Identifier | t.StringLiteral

export default function(path: NodePath<t.JSXOpeningElement>): Tag {
  const namePath = path.node.name
  if (t.isJSXIdentifier(namePath)) {
    const name = namePath.name
    if (path.scope.hasBinding(name) && !htmlTags.includes(name) && !svgTags.includes(name)) {
      // as component
      return t.identifier(name)
    } else {
      // as dom tag
      return t.stringLiteral(name)
    }
  }

  if (t.isJSXMemberExpression(namePath)) {
    // TODO: transformJSXMemberExpression
    // return transformJSXMemberExpression(t, namePath)
  }

  throw new Error(`getTag: ${namePath.type} is not supported`)
}
