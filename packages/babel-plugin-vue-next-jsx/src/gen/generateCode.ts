/**
 * generate code fragments
 */

import { types as t } from '@babel/core';
import { CREATE_BLOCK, CREATE_TEXT, CREATE_VNODE, helperNameMap, OPEN_BLOCK, TO_DISPLAY_STRING } from '../util/constant';

export const importTransform = (s) => `_${s}`

export const generateBlock = (args) => {
  const _openBlock = t.identifier(importTransform(helperNameMap[OPEN_BLOCK]));
  const _createBlock = t.identifier(importTransform(helperNameMap[CREATE_BLOCK]));
  const openCall =  t.callExpression(_openBlock, [])
  const creatCall = t.callExpression(_createBlock, args)
  const sequence = t.sequenceExpression([openCall, creatCall])
  return t.expressionStatement(sequence)
}

/**
 * generate _call()
 * @param args
 * @param type
 */
export const generateCall = (args, type): t.CallExpression => {
  const _name = importTransform(helperNameMap[type])
  return t.callExpression(t.identifier(_name), args)
}
