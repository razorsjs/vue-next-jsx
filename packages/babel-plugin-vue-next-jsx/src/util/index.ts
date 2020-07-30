import { NodePath, types as t } from '@babel/core';
import {
  BASE_TRANSITION,
  CREATE_TEXT,
  CREATE_VNODE,
  extend,
  helperNameMap,
  hyphenate,
  KEEP_ALIVE,
  SUSPENSE,
  TELEPORT,
  TO_DISPLAY_STRING,
} from './constant';
import jsxNode, { AttributeNode, JsxNode, PluginOptions } from '../jsxNode';
import { ElementTypes } from '@vue/compiler-core';
import domOptions from '../domOptions';

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
  if(t.isObjectExpression(value)) {
    return value.properties.some(i=>{
      if(t.isObjectProperty(i)) {
        return isDynamic(i.value)
      }
    })
  }
  if(t.isArrayExpression(value)) {
    return value.elements.some(i=>{
      return isDynamic(i)
    })
  }
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
  const {tagType, vnodeTag, renderAsBlock} = node
  const isComponent = tagType === ElementTypes.COMPONENT
  // <svg> and <foreignObject> must be forced into blocks so that block
  // updates inside get proper isSVG flag at runtime. (#639, #643)
  // This is technically web-specific, but splitting the logic out of core
  // leads to too much unnecessary complexity.

  // dynamic key will use renderAsBlock (:key="a")
  return renderAsBlock || vnodeTag === KEEP_ALIVE || (!isComponent && (vnodeTag === 'svg' || vnodeTag === 'foreignObject'))
}

export const importTransform = (s) => `_${s}`

// do set only in some methods
export const proxyMethod = (handler: ProxyHandler<any>, method: string) => {
  const {get, set} = handler
  if(!set) throw new Error('handler must have set methods')
  let isIn = false;
  handler.get = (target, value, receiver) => {
    if(value === method) {
      isIn = true
    }
    return get ? get(target, value, receiver) : Reflect.get(target, value, receiver)
  };
  handler.set = (target, value, props, receiver) => {
    if(isIn) {
      isIn = false
      return set(target, value, props, receiver)
    } else {
      return Reflect.set(target, value, props, receiver)
    }
  };
  return handler
}
