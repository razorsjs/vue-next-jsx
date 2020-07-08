/**
 * extract patchFlag from props, texts
 */

import { types as t } from '@babel/core';
import { PatchFlags } from './constant';
import jsxNode, { AttributeNode, DirectiveNode } from './jsxNode';
import { NodeTypes } from '@vue/compiler-core';

const isDynamic = (value) => {
  return !t.isLiteral(value)
}

/**
 * judge if has DynamicClass
 * @param prop
 */
const isClassBinding = (prop: AttributeNode | DirectiveNode) => {
  return prop.type === NodeTypes.ATTRIBUTE && prop.name && prop.name === 'class' && prop.value && isDynamic(prop.value)
}
/**
 * judge if has DynamicStyle
 * @param prop
 */
const isStyleBinding = (prop: AttributeNode | DirectiveNode) => {
  return prop.type === NodeTypes.ATTRIBUTE && prop.name && prop.name === 'style' && prop.value && isDynamic(prop.value)
}

const addFlags = (num: number) => {
  // TODO: change to ??, need to chage ts version?
  jsxNode.patchFlags = jsxNode.patchFlags || 0;
  jsxNode.patchFlags|=num
}

export const extractPatchFlagFromProps = () => {
  const {props} = jsxNode
  let classBinding = false;
  let styleBinding = false;

  props.forEach(prop => {
    if(!classBinding && isClassBinding(prop)) {
      classBinding = true
      addFlags(PatchFlags.CLASS)
    }
    if(!styleBinding && isStyleBinding(prop)) {
      styleBinding = true
      addFlags(PatchFlags.STYLE)
    }
  })
}
