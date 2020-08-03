/**
 * When use this, mind that you should push to attributes or directives manually
 * If we detected that the key is typeof regexp, we will use .test to match
 * More than one matches, newer will override older
 */

import {types as t} from '@babel/core'
import { AttributeNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '../util/constant';
import is from './is'
import v_ from './v-'
import v from './v'
import on from './on'
import style from './style';
import __children from './__children'

export const defaultAttrParse = (name: string, value: any, index: number, jsxNode: JsxNode) => {
  if(!value) {
    value = t.booleanLiteral(true);
  }
  const attributeNode: AttributeNode = {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
    index
  };
  jsxNode.attributes.push(attributeNode);
}

const internalMap = new Map()
internalMap.set('is', is)
internalMap.set(/^v-/g, v_)
internalMap.set(/^v[A-Z]/g, v)
internalMap.set(/^on[A-Z]/g, on)
internalMap.set('style', style)
internalMap.set('__children', __children)

export default internalMap
