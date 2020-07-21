/**
 * If use this, mind that you should push to attributes or directives manually
 * If we detected that key is an regexp, we will use Regexp() to match
 * If more than one match, newer will override older
 */

import { AttributeNode, JsxNode } from '../jsxNode';
import { NodeTypes } from '../util/constant';
import is from './is'
import v_ from './v-'
import v from './v'
import on from './on'
import style from './style';

export const defaultAttrTransform = (name: string, value: any, jsxNode: JsxNode) => {
  const attributeNode: AttributeNode = {
    type: NodeTypes.ATTRIBUTE,
    name,
    value,
  };
  jsxNode.attributes.push(attributeNode);
}

const internalMap = new Map()
internalMap.set('is', is)
internalMap.set(/^v-/g, v_)
internalMap.set(/^v[A-Z]/g, v)
internalMap.set(/^on[A-Z]/g, on)
internalMap.set('style', style)

export default internalMap
