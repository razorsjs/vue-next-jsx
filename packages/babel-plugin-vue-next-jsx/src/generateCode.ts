/**
 * generate code fragments
 */

import { types as t } from '@babel/core';
import { CREATE_BLOCK, CREATE_TEXT, CREATE_VNODE, helperNameMap, OPEN_BLOCK } from './constant';

export const importTransform = (s) => `_${s}`

export const generateBlock = (args) => {
  const _openBlock = t.identifier(importTransform(helperNameMap[OPEN_BLOCK]));
  const _createBlock = t.identifier(importTransform(helperNameMap[CREATE_BLOCK]));
  const openCall =  t.callExpression(_openBlock, [])
  const creatCall = t.callExpression(_createBlock, args)
  const sequence = t.sequenceExpression([openCall, creatCall])
  return t.expressionStatement(sequence)
}

export const generateCreateVNode = (args): t.CallExpression => {
  const _createVNode = t.identifier(importTransform(helperNameMap[CREATE_VNODE]));
  return t.callExpression(_createVNode, args)
}

export const generateTextVNode = (args): t.CallExpression => {
  const _createTextVNode = t.identifier(importTransform(helperNameMap[CREATE_TEXT]));
  return t.callExpression(_createTextVNode, args)
}
