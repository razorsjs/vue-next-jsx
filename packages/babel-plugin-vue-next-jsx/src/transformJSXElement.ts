/**
 * transformJSXElement
 */
import {types as t} from '@babel/core'
import genTag from './genTag'
import genChildren from './genChildren';
import genProps from './genProps';
import jsxNode from './jsxNode';

export const transformJSXElement = (): t.ExpressionStatement | t.CallExpression => {
  const {path, options} = jsxNode
  // gen props
  genProps()
  // gen tag
  genTag()
  // gen children
  genChildren(path.get('children'))
  // build
  return options.build(jsxNode)
}
