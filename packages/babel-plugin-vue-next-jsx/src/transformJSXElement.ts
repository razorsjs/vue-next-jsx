/**
 * main transformJSXElement
 */

import {types as t} from '@babel/core'
import genTag from './genTag'
import genChildren from './genChildren';
import genProps from './genProps';
import jsxNode from './jsxNode';

export const transformJSXElement = (): t.ExpressionStatement | t.CallExpression => {
  const {options} = jsxNode
  // gen props
  genProps()
  // gen tag
  genTag()
  // gen children
  genChildren()
  // build
  return options.build(jsxNode)
}
