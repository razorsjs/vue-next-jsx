import { NodePath, types as t } from '@babel/core';
import jsxNode from '../jsxNode';
import { PatchFlags } from '../util/constant';
import { NodeTypes } from '@vue/compiler-core';
import genText from '../gen/genText'

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

const transformJSXSpreadChild = (path: NodePath<t.JSXSpreadChild>): t.SpreadElement => t.spreadElement(path.node.expression)

export default function() {
  const {path} = jsxNode
  const paths: Array<any> = path.get('children') as any

  const nodes: Array<ChildNode> = paths.map(path => {
      if (path.isJSXText()) {
        return transformJSXText(path)
      }
      // treated as vue: {{XX}}
      if (path.isJSXExpressionContainer()) {
        const isTextVNode = paths.length > 1
        if(!isTextVNode) {
          jsxNode.patchFlag|=PatchFlags.TEXT
        }
        return genText(path.node, isTextVNode)
      }
      if (path.isJSXSpreadChild()) {
        return transformJSXSpreadChild(path)
      }
      if (path.isCallExpression() || path.isSequenceExpression()) {
        return path.node
      }
      /* istanbul ignore next */
      throw new Error(`getChildren: ${path.type} is not supported`)
    })
    .filter(el => el !== null && !t.isJSXEmptyExpression(el));

  jsxNode.children = nodes
}
