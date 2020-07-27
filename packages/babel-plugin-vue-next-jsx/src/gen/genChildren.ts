import { NodePath, types as t } from '@babel/core';
import jsxNode from '../jsxNode';
import { CREATE_TEXT, PatchFlags, TO_DISPLAY_STRING } from '../util/constant';
import { NodeTypes } from '@vue/compiler-core';
import genText from '../gen/genText'
import { generateCall } from './generateCode';

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

const transformJSXExpressionContainer = (path: NodePath<t.JSXExpressionContainer>, paths) => {
  const {node: {expression}} = path
  // object for slot special
  // array for v-for special
  if(!t.isObjectExpression(expression) && !t.isArrayExpression(expression)) {
    const isTextVNode = paths.length > 1
    if(t.isIdentifier(expression) && !isTextVNode) {
      jsxNode.patchFlag|=PatchFlags.TEXT
    }
    return genText(path.node, isTextVNode)
  }
  return expression
}

export default function() {
  const {path} = jsxNode
  const paths: Array<any> = path.get('children') as any
  const isFragment = t.isJSXFragment(path.node)

  let nodes: Array<any> = []
  let text: any = [];
  // sibling text will be merged as textVNode
  const mergeText = (text) => {
    if(text.length === 1) {
      const path = text[0]
      return path.isJSXText() ? transformJSXText(path) : transformJSXExpressionContainer(path,paths)
    } else {
      const transform = (path) => path.isJSXText() ? transformJSXText(path) : generateCall([path.node.expression], TO_DISPLAY_STRING)
      let binary = t.binaryExpression('+',transform(text[0]), transform(text[1]))
      for(let i=2;i<text.length;i++) {
        binary = t.binaryExpression('+', binary, transform(text[i]))
      }
      return generateCall([binary, t.numericLiteral(1)], CREATE_TEXT)
    }
  }
  paths.forEach(path => {
    if (path.isJSXText() || path.isJSXExpressionContainer()) {
      text.push(path)
    } else {
      // not text
      if(text.length) {
        nodes.push(mergeText(text));
        text = [];
      }
      if (path.isJSXSpreadChild()) {
        nodes.push(transformJSXSpreadChild(path))
      } else if (path.isCallExpression() || path.isSequenceExpression()) {
        nodes.push(path.node)
      } else {
        /* istanbul ignore next */
        throw new Error(`getChildren: ${path.type} is not supported`)
      }
    }
  });
  if(text.length) {
    nodes.push(mergeText(text));
  }
  nodes = nodes.filter(el => el !== null && !t.isJSXEmptyExpression(el));

  if(isFragment) {
    jsxNode.patchFlag|=PatchFlags.STABLE_FRAGMENT
  }

  jsxNode.children = nodes
}
