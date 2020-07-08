import { types as t } from '@babel/core';
import { PatchFlags } from './constant';
import jsxNode, { AttributeNode, DirectiveNode } from './jsxNode';
import { NodeTypes } from '@vue/compiler-core';

/**
 * judge if has DynamicClass
 * @param prop
 */
const hasClassBinding = (prop: AttributeNode | DirectiveNode) => {
  return prop.type === NodeTypes.ATTRIBUTE && prop.value && !t.isStringLiteral(prop.value)
}

const addFlags = (num: number) => {
  jsxNode.patchFlags|=0;
  jsxNode.patchFlags+=num
}

export const extractPatchFlagFromProps = () => {
  const {props} = jsxNode
  let classBinding;

  props.forEach(prop => {
    if(!classBinding && hasClassBinding(prop)) {
      classBinding = true
      addFlags(PatchFlags.CLASS)
    }
  })
}
