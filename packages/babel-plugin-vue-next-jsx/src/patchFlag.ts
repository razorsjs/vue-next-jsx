/**
 * extract patchFlag from props, texts
 */

import { types as t } from '@babel/core';
import { PatchFlags, ElementTypes, isOn, helperNameMap, isSymbol } from './util/constant';
import jsxNode, { AttributeNode, DirectiveNode, DirectiveTransform, DirectiveTransformResult } from './jsxNode';
import {addVueImport} from './addVueImport';
import {defaultDirectiveTransform} from './directives'
import {isDynamic} from'./util'
import { isStaticExp } from './util/resolveModifiers';

export const extractPatchFlag = () => {
  const {attributes, directives, tagType, options} = jsxNode
  const isComponent = tagType === ElementTypes.COMPONENT
  let hasRef = false
  let hasClassBinding = false
  let hasStyleBinding = false
  let hasHydrationEventBinding = false
  let hasDynamicKeys = false
  let dynamicPropNames: string[] = []
  // record only runtime
  const runtimeDirectives = []
  // record all props
  const directiveTransformResult: Array<t.ArrayExpression | undefined> = []

  /**
   * run directive transform
   */
  directives.forEach((dir) => {
    const directiveTransform: DirectiveTransform = options.directiveTransforms[dir.name]
    if (directiveTransform) {
      // has built-in directive transform.
      const transformResult = directiveTransform(dir, jsxNode)
      // directiveTransform can return void like v-text
      if(transformResult) {
        const {props, needRuntime} = transformResult
        directiveTransformResult.push(t.arrayExpression(props))
        if (needRuntime) {
          runtimeDirectives.push(dir)
          if (isSymbol(needRuntime)) {
            addVueImport(needRuntime)
          }
        }
      }
    } else {
      // no built-in transform, this is a user custom directive.
      const { props } = defaultDirectiveTransform(dir, jsxNode)
      directiveTransformResult.push(t.arrayExpression(props))
      runtimeDirectives.push(dir)
    }
  })

  /**
   * onXXX all be treated as listener like v-on, e.g. onClick <==> v-on:click <==> @click
   */
  attributes.forEach((attr: AttributeNode) => {
    const {name, value} = attr
    if(isStaticExp(name)) {
      if (name === 'ref') {
        hasRef = true
      }
      if(isDynamic(value) && !attr.static) {
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
    } else {
      hasDynamicKeys = true
    }
  })

  const {patchFlag} = jsxNode
  dynamicPropNames = jsxNode.dynamicProps.concat(dynamicPropNames)
  if (hasDynamicKeys) {
    jsxNode.patchFlag |= PatchFlags.FULL_PROPS
  } else {
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
  }

  if (
    (patchFlag === 0 || patchFlag === PatchFlags.HYDRATE_EVENTS) &&
    (hasRef) || runtimeDirectives?.length
  ) {
    jsxNode.patchFlag |= PatchFlags.NEED_PATCH
  }

  jsxNode.dynamicProps = dynamicPropNames
  jsxNode.directiveTransformResult = directiveTransformResult
}
