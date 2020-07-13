/**
 * main transformJSXElement
 */

import {types as t} from '@babel/core'
import genTag from './gen/genTag'
import genChildren from './gen/genChildren';
import genProps from './gen/genProps';
import jsxNode from './jsxNode';

export const transformJSXElement = (): t.SequenceExpression | t.CallExpression => {
  const {options} = jsxNode
  // gen tag
  genTag()
  // gen props
  genProps()
  // gen children
  genChildren()
  // build
  return options.build(jsxNode)
}
