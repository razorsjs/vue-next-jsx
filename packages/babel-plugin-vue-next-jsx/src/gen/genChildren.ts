import { NodePath, types as t } from '@babel/core';
import jsxNode from '../jsxNode';
import { CREATE_TEXT, ElementTypes, PatchFlags, TO_DISPLAY_STRING } from '../util/constant';
import { NodeTypes } from '@vue/compiler-core';
import genText from '../gen/genText'
import { generateCall } from './generateCode';

const transformJSXText = (path: NodePath<t.JSXText>): t.StringLiteral | null => {
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

const transformJSXSpreadChild = (node: t.JSXSpreadChild): t.SpreadElement => t.spreadElement(node.expression)

/**
 * In components, only literal will be treated as text
 * In element, expect call and function(as slot) , array(as children), will be treated as text
 */
const isTextContainer = (node: t.JSXExpressionContainer, isComponent: boolean) => {
  const {expression} = node
  if(isComponent) {
    return t.isLiteral(expression)
  } else {
    return !t.isCallExpression(expression) && !t.isFunction(expression) && !t.isArrayExpression(expression) && !t.isObjectExpression(expression)
  }
}

const transformJSXExpressionContainer = (node: t.JSXExpressionContainer) => node.expression

const transformJSXExpressionTextContainer = (node: t.JSXExpressionContainer, paths) => {
  const {expression} = node
  const isTextVNode = paths.length > 1
  if((t.isIdentifier(expression) || t.isMemberExpression(expression)) && !isTextVNode) {
    jsxNode.patchFlag|=PatchFlags.TEXT
  }
  return genText(node, isTextVNode)
}

export default function() {
  const {path} = jsxNode
  const paths: Array<any> = path.get('children') as any
  const isFragment = t.isJSXFragment(path.node)
  const isComponent = jsxNode.tagType === ElementTypes.COMPONENT

  let nodes: Array<any> = []
  const children: Array<any> =[]
  let text: any = [];
  // sibling text will be merged as textVNode
  const transform = (node: t.StringLiteral | t.JSXExpressionContainer) => t.isStringLiteral(node) ? node : generateCall([node.expression], TO_DISPLAY_STRING)
  const mergeText = (texts: Array<t.StringLiteral | t.JSXExpressionContainer>) => {
    if(texts.length === 1) {
      const text = texts[0]
      // Return genText if multiple
      if(t.isStringLiteral(text)) {
        return nodes.length > 1 ? generateCall([text], CREATE_TEXT): text
      } else {
        return transformJSXExpressionTextContainer(text, nodes)
      }
    } else {
      const _text = texts.map(item => {
        if(t.isJSXExpressionContainer(item) && !isFragment) jsxNode.patchFlag|=PatchFlags.TEXT
        return transform(item)
      }).filter(el => el !== null && !t.isJSXEmptyExpression(el));
      let binary = t.binaryExpression('+',_text[0], _text[1])
      for(let i=2;i<_text.length;i++) {
        binary = t.binaryExpression('+', binary, _text[i])
      }
      return isFragment ? generateCall([binary, t.numericLiteral(1)], CREATE_TEXT) : binary
    }
  }
  const pushText = () => {
    if(text.length) {
      children.push(mergeText(text));
      text = [];
    }
  }
  // clear empty
  nodes = paths.map(path => path.isJSXText() ? transformJSXText(path) : path.node).filter(el => el !== null && !t.isJSXEmptyExpression(el))

  for(let i=0;i<nodes.length;i++) {
    const node = nodes[i]
    if (t.isStringLiteral(node)) {
      text.push(node)
    } else if(t.isJSXExpressionContainer(node)) {
      if(isTextContainer(node, isComponent)) {
        text.push(node)
      } else {
        pushText()
        children.push(transformJSXExpressionContainer(node))
      }
    } else {
      pushText()
      if (t.isJSXSpreadChild(node)) {
        children.push(transformJSXSpreadChild(node))
      } else if (t.isCallExpression(node) || t.isSequenceExpression(node)) {
        children.push(node)
      } else {
        /* istanbul ignore next */
        throw new Error(`getChildren: is not supported`)
      }
    }
  }
  pushText()

  if(isFragment) {
    jsxNode.patchFlag|=PatchFlags.STABLE_FRAGMENT
  }

  jsxNode.children = children
}
