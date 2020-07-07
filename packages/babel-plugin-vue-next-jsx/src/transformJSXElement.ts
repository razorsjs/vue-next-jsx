/**
 * transformJSXElement
 */
import {NodePath, types as t} from '@babel/core'
import genTag from './genTag'
import { helperNameMap, OPEN_BLOCK, CREATE_BLOCK, CREATE_VNODE, CREATE_TEXT } from './constant';
import {importTransform} from './util';
import genChildren from './genChildren';
import genAttrs from './genAttributes'

const generateBlock = (args) => {
  const _openBlock = t.identifier(importTransform(helperNameMap[OPEN_BLOCK]));
  const _createBlock = t.identifier(importTransform(helperNameMap[CREATE_BLOCK]));
  const openCall =  t.callExpression(_openBlock, [])
  const creatCall = t.callExpression(_createBlock, args)
  const sequence = t.sequenceExpression([openCall, creatCall])
  return t.expressionStatement(sequence)
}

const generateCreateVNode = (args): t.CallExpression => {
  const _createVNode = t.identifier(importTransform(helperNameMap[CREATE_VNODE]));
  return t.callExpression(_createVNode, args)
}

export const generateTextVNode = (args): t.CallExpression => {
  const _createTextVNode = t.identifier(importTransform(helperNameMap[CREATE_TEXT]));
  return t.callExpression(_createTextVNode, args)
}

export const transformJSXElement = (path: NodePath<t.JSXElement>): t.ExpressionStatement | t.CallExpression => {
  const openingElementPath: NodePath<t.JSXOpeningElement> = path.get('openingElement')
  // gen tag
  const tag = genTag(openingElementPath)
  // gen children
  const children = genChildren(path.get('children'))
  // gen attrs
  const attrs = genAttrs(openingElementPath.get('attributes'))
  const args: any = [tag]
  if(children) {
    args.push(t.isNullLiteral(attrs) ? attrs: attrs.data)
    args.push(children)
    if(!t.isNullLiteral(attrs) && attrs.patchFlags) {
      args.push(t.numericLiteral(attrs.patchFlags))
    }
  }
  // generate
  if(t.isJSXElement(path.parent)) {
    return generateCreateVNode(args)
  } else {
    return generateBlock(args)
  }
}
