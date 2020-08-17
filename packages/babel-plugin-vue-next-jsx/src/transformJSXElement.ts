/**
 * main transformJSXElement
 */

import {types as t} from '@babel/core'
import genTag from './gen/genTag'
import genChildren from './gen/genChildren';
import genProps from './gen/genProps';
import jsxNode from './jsxNode';
import {beforeBuild} from './lifecycle/beforeBuild';

export const transformJSXElement = (): t.SequenceExpression | t.CallExpression => {
  const {options} = jsxNode
  // gen tag
  genTag()
  // gen props
  genProps()
  // gen children
  genChildren()
  // Before build: modify jsxnode the last time
  beforeBuild(jsxNode)
  return options.build(jsxNode)
}
