import {types as t} from '@babel/core';
import {generateCall} from './generateCode';
import { CREATE_TEXT, TO_DISPLAY_STRING } from '../util/constant';

/**
 * gen TextVNode or displayString: use for jsx:{a} <==> vue:{{a}}
 */
export default function(expression: t.JSXExpressionContainer, isTextVNode?: boolean): t.CallExpression {
  const exp = expression.expression
  let result = generateCall([exp], TO_DISPLAY_STRING)
  if(isTextVNode) {
    result = generateCall([result, t.numericLiteral(1)], CREATE_TEXT)
  }
  return result
}
