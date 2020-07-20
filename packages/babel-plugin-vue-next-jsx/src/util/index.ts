import { NodePath, types as t } from '@babel/core';
import { BASE_TRANSITION, CREATE_TEXT, CREATE_VNODE, helperNameMap, hyphenate, KEEP_ALIVE, SUSPENSE, TELEPORT, TO_DISPLAY_STRING } from './constant';
import { importTransform } from '../gen/generateCode';
import { JsxNode } from '../jsxNode';
import { ElementTypes } from '@vue/compiler-core';

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
  // if () => [], will add wrap [] in child, not in there
  const isCreateTextVNode = t.isCallExpression(value)
    && t.isIdentifier(value.callee)
    && value.callee.name === importTransform(helperNameMap[CREATE_TEXT])
  const isCreateVnode = t.isCallExpression(value)
    && t.isIdentifier(value.callee)
    && value.callee.name === importTransform(helperNameMap[CREATE_VNODE])
  const isOpenBlock = t.isSequenceExpression(value)
  return isCreateVnode || isOpenBlock || isCreateTextVNode
}

export const isRoot = (path: NodePath<any>): boolean =>  {
  return t.isExpressionStatement(path.parent)
}

export const isDynamic = (value) => {
  return !t.isLiteral(value)
}

export const getContent = (node): string => {
  if(t.isNumericLiteral(node)) return node.value.toString()
  if(t.isIdentifier(node)) return node.name
  if(t.isStringLiteral(node)) return node.value
}

export const isBuiltInType = (tag: string, expected: string): boolean =>
  tag === expected || tag === hyphenate(expected)

export function isCoreComponent(tag: string): symbol | void {
  if (isBuiltInType(tag, 'Teleport')) {
    return TELEPORT
  } else if (isBuiltInType(tag, 'Suspense')) {
    return SUSPENSE
  } else if (isBuiltInType(tag, 'KeepAlive')) {
    return KEEP_ALIVE
  } else if (isBuiltInType(tag, 'BaseTransition')) {
    return BASE_TRANSITION
  }
}

export function shouldUseBlock(node: JsxNode) {
  const {tagType, vnodeTag} = node
  const isComponent = tagType === ElementTypes.COMPONENT
  // <svg> and <foreignObject> must be forced into blocks so that block
  // updates inside get proper isSVG flag at runtime. (#639, #643)
  // This is technically web-specific, but splitting the logic out of core
  // leads to too much unnecessary complexity.
  return vnodeTag === KEEP_ALIVE || (!isComponent && (vnodeTag === 'svg' || vnodeTag === 'foreignObject'))
}

const firstWordRE = /^(\w)/g
export function camelizeFirstWord(str) {
  return str.replace(firstWordRE, (_, c) => (c ? c.toUpperCase() : ''))
}
