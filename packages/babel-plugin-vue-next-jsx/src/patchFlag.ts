/**
 * extract patchFlag from props, texts
 */

import { types as t } from '@babel/core';
import { PatchFlags, ElementTypes, isOn } from './util/constant';
import jsxNode, { AttributeNode, DirectiveNode } from './jsxNode';

// dynamic check
const isDynamic = (value) => {
  return !t.isLiteral(value)
}

export const extractPatchFlag = () => {
  const {attributes, tagType} = jsxNode
  const isComponent = tagType === ElementTypes.COMPONENT
  let hasRef = false
  let hasClassBinding = false
  let hasStyleBinding = false
  let hasHydrationEventBinding = false
  const dynamicPropNames: string[] = []
  jsxNode.patchFlag = 0

  /**
   * onXXX all be treated as listener like v-on, e.g. onClick <==> v-on:click <==> @click
   */
  /**
   * Dynamic keys: not supported
   */
  attributes.forEach((attr: AttributeNode) => {
    const {name, value} = attr
    if (name === 'ref') {
      hasRef = true
    }
    if(isDynamic(value)) {
      if (
        !isComponent &&
        isOn(name) &&
        // omit the flag for click handlers becaues hydration gives click
        // dedicated fast path.
        name.toLowerCase() !== 'onclick' &&
        // omit v-model handlers
        name !== 'onUpdate:modelValue'
      ) {
        hasHydrationEventBinding = true
      }
      if (name === 'class' && !isComponent) {
        hasClassBinding = true
      } else if (name === 'style' && !isComponent) {
        hasStyleBinding = true
      } else if (name !== 'key' && !dynamicPropNames.includes(name)) {
        dynamicPropNames.push(name)
      }
    }
  })

  const {patchFlag} = jsxNode

  if (hasClassBinding) {
    jsxNode.patchFlag |= PatchFlags.CLASS
  }
  if (hasStyleBinding) {
    jsxNode.patchFlag |= PatchFlags.STYLE
  }
  if (dynamicPropNames.length) {
    jsxNode.patchFlag |= PatchFlags.PROPS
  }
  if (hasHydrationEventBinding) {
    jsxNode.patchFlag |= PatchFlags.HYDRATE_EVENTS
  }

  if (
    (patchFlag === 0 || patchFlag === PatchFlags.HYDRATE_EVENTS) &&
    (hasRef)
  ) {
    jsxNode.patchFlag |= PatchFlags.NEED_PATCH
  }

  jsxNode.dynamicProps = dynamicPropNames
}
