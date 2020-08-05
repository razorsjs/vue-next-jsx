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

const transformJSXSpreadChild = (path: NodePath<t.JSXSpreadChild>): t.SpreadElement => t.spreadElement(path.node.expression)

/**
 * In components, only literal will be treated as text
 * In element, expect call and function(as slot) , array(as children), will be treated as text
 * @param path
 */
const isTextContainer = (path: NodePath<t.JSXExpressionContainer>, isComponent: boolean) => {
  const {node: {expression}} = path
  if(isComponent) {
    return t.isLiteral(expression)
  } else {
    return !t.isCallExpression(expression) && !t.isFunction(expression) && !t.isArrayExpression(expression) && !t.isObjectExpression(expression)
  }
}

const transformJSXExpressionContainer = (path: NodePath<t.JSXExpressionContainer>) => {
  // Literal function () => <div><div> to {default: () => <div></div>}
  let {node: {expression}} = path
  // note: render function such as renderSlot() must be wrapped with []
  if(t.isCallExpression(expression)) {
    expression = t.arrayExpression([expression])
  }
  return expression
}

const transformJSXExpressionTextContainer = (path: NodePath<t.JSXExpressionContainer>, paths) => {
  const {node: {expression}} = path
  const isTextVNode = paths.length > 1
  if((t.isIdentifier(expression) || t.isMemberExpression(expression)) && !isTextVNode) {
    jsxNode.patchFlag|=PatchFlags.TEXT
  }
  return genText(path.node, isTextVNode)
}

export default function() {
  const {path} = jsxNode
  const paths: Array<any> = path.get('children') as any
  const isFragment = t.isJSXFragment(path.node)
  const isComponent = jsxNode.tagType === ElementTypes.COMPONENT

  let nodes: Array<any> = []
  let text: any = [];
  // sibling text will be merged as textVNode
  const transform = (path) => path.isJSXText() ? transformJSXText(path) : generateCall([path.node.expression], TO_DISPLAY_STRING)
  const mergeText = (text) => {
    if(text.length === 1) {
      const path = text[0]
      return path.isJSXText() ? transformJSXText(path) : transformJSXExpressionTextContainer(path, paths)
    } else {
      const _text = text.map(item => {
        if(item.isJSXExpressionContainer() && !isFragment) jsxNode.patchFlag|=PatchFlags.TEXT
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
      nodes.push(mergeText(text));
      text = [];
    }
  }
  for(let i=0;i<paths.length;i++) {
    const path = paths[i]
    if (path.isJSXText()) {
      const transformed = transformJSXText(path)
      // TODO: remove duplicate transform
      if(transformed!==null) {
        text.push(path)
      } else {
        // remove blank in paths
        paths.splice(i--, 1)
      }
    } else if(path.isJSXExpressionContainer()) {
      if(isTextContainer(path, isComponent)) {
        text.push(path)
      } else {
        pushText()
        nodes.push(transformJSXExpressionContainer(path))
      }
    } else {
      pushText()
      if (path.isJSXSpreadChild()) {
        nodes.push(transformJSXSpreadChild(path))
      } else if (path.isCallExpression() || path.isSequenceExpression()) {
        nodes.push(path.node)
      } else {
        /* istanbul ignore next */
        throw new Error(`getChildren: ${path.type} is not supported`)
      }
    }
  }
  pushText()
  nodes = nodes.filter(el => el !== null && !t.isJSXEmptyExpression(el));

  if(isFragment) {
    jsxNode.patchFlag|=PatchFlags.STABLE_FRAGMENT
  }

  jsxNode.children = nodes
}
