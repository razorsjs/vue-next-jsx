import {types as t, NodePath} from '@babel/core';
import {generateTextVNode} from './transformJSXElement';

/**
 * Transform JSXText to StringLiteral
 * @param path JSXText
 * @returns StringLiteral
 */
const transformJSXText = (path: NodePath<t.JSXText>): t.StringLiteral => {
  const node = path.node
  const lines = node.value.split(/\r\n|\n|\r/)

  let lastNonEmptyLine = 0

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/[^ \t]/)) {
      lastNonEmptyLine = i
    }
  }

  let str = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const isFirstLine = i === 0
    const isLastLine = i === lines.length - 1
    const isLastNonEmptyLine = i === lastNonEmptyLine

    // replace rendered whitespace tabs with spaces
    let trimmedLine = line.replace(/\t/g, ' ')

    // trim whitespace touching a newline
    if (!isFirstLine) {
      trimmedLine = trimmedLine.replace(/^[ ]+/, '')
    }

    // trim whitespace touching an endline
    if (!isLastLine) {
      trimmedLine = trimmedLine.replace(/[ ]+$/, '')
    }

    if (trimmedLine) {
      if (!isLastNonEmptyLine) {
        trimmedLine += ' '
      }

      str += trimmedLine
    }
  }

  return str !== '' ? t.stringLiteral(str) : null
}
/**
 * Transform JSXExpressionContainer to Expression
 * @param path JSXExpressionContainer
 * @returns Expression
 */
const transformJSXExpressionContainer = (path: NodePath<t.JSXExpressionContainer>): t.Expression | t.JSXEmptyExpression => path.node.expression
/**
 * Transform JSXSpreadChild
 * @param t
 * @param path JSXSpreadChild
 * @returns SpreadElement
 */
const transformJSXSpreadChild = (path: NodePath<t.JSXSpreadChild>): t.SpreadElement => t.spreadElement(path.node.expression)

export default function(paths) {
  const nodes = paths.map(path => {
      if (path.isJSXText()) {
        return transformJSXText(path)
      }
      if (path.isJSXExpressionContainer()) {
        return transformJSXExpressionContainer(path)
      }
      if (path.isJSXSpreadChild()) {
        return transformJSXSpreadChild(path)
      }
      if (path.isCallExpression()) {
        return path.node
      }
      /* istanbul ignore next */
      throw new Error(`getChildren: ${path.type} is not supported`)
    })
    .filter(el => el !== null && !t.isJSXEmptyExpression(el));

  if(nodes.length === 1 && t.isStringLiteral(nodes[0])) {
    // only one
    return nodes[0]
  } else if (nodes.length === 0) {
    // no children
    return null
  } else {
    // wrap string children with _createTextVNode
    for(let i=0;i<nodes.length;i++){
      const node = nodes[i]
      if(t.isStringLiteral(node)) {
        nodes[i] = generateTextVNode([node])
      }
    }
    return t.arrayExpression(nodes)
  }
}
