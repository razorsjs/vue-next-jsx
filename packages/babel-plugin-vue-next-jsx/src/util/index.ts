import {types as t, NodePath} from '@babel/core';
import { CREATE_VNODE, helperNameMap, TO_DISPLAY_STRING } from './constant';
import { importTransform } from '../gen/generateCode';

/**
 * jsxText will be transformed to stringLiteral in slot
 */
export const isText = (value: t.Expression): boolean => {
  return t.isStringLiteral(value)
}

export const isTextVNode = (value: t.Expression): boolean => {
  return t.isCallExpression(value)
    && t.isIdentifier(value.callee)
    && value.callee.name === importTransform(helperNameMap[TO_DISPLAY_STRING])
}

export const isVNode = (value: t.Expression): boolean => {
  return t.isCallExpression(value)
    && t.isIdentifier(value.callee)
    && value.callee.name === importTransform(helperNameMap[CREATE_VNODE])
}

export const isLeaf = (path: NodePath<any>): boolean =>  {
  return !t.isExpressionStatement(path.parent)
}

export const isDynamic = (value) => {
  return !t.isLiteral(value)
}

export const getContent = (node): string => {
  if(t.isNumericLiteral(node)) return node.value.toString()
  if(t.isIdentifier(node)) return node.name
  if(t.isStringLiteral(node)) return node.value
}
