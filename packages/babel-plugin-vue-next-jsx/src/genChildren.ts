import {types as t, NodePath} from '@babel/core';
import jsxNode from './jsxNode';

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
const transformJSXExpressionContainer = (path: NodePath<t.JSXExpressionContainer>): t.Expression | t.JSXEmptyExpression => path.node.expression
const transformJSXSpreadChild = (path: NodePath<t.JSXSpreadChild>): t.SpreadElement => t.spreadElement(path.node.expression)

export default function() {
  const {path} = jsxNode
  const paths: Array<any> = path.get('children')
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

  jsxNode.children = nodes
}
