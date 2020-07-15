/**
 * generate code fragments
 */

import { types as t } from '@babel/core';
import { CREATE_BLOCK, CREATE_TEXT, CREATE_VNODE, helperNameMap, OPEN_BLOCK, TO_DISPLAY_STRING } from '../util/constant';
import { addVueImport } from '../addVueImport';

export const importTransform = (s) => `_${s}`

export const generateBlock = (args): t.SequenceExpression => {
  const _openBlock = t.identifier(addVueImport(OPEN_BLOCK));
  const _createBlock = t.identifier(addVueImport(CREATE_BLOCK));
  const openCall =  t.callExpression(_openBlock, [])
  const creatCall = t.callExpression(_createBlock, args)
  const sequence = t.sequenceExpression([openCall, creatCall])
  return sequence
}

/**
 * generate _call()
 * @param args
 * @param type
 */
export const generateCall = (args, type): t.CallExpression => {
  const _name = addVueImport(type)
  return t.callExpression(t.identifier(_name), args)
}
