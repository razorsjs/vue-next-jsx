/**
 * gen tag from path
 */

import { NodePath, types as t } from '@babel/core';
import jsxNode from '../jsxNode';
import { ElementTypes, FRAGMENT, isSymbol, PatchFlags, camelize } from '../util/constant';
import { addVueImport } from '../addVueImport';
import {isCoreComponent,camelizeFirstWord} from '../util'

export const resolveTag = (tag): string | symbol => {
  const { options } = jsxNode

  // 1. dynamic component

  // 2. built-in components (Teleport, Transition, KeepAlive, Suspense...)
  const builtIn = isCoreComponent(tag) || (options.isBuiltInComponent && options.isBuiltInComponent(tag))
  if (builtIn) {
    // built-ins are simply fallthroughs / have special handling during ssr
    // no we don't need to import their runtime equivalents
    return builtIn as symbol
  }
  return tag
}

export default function() {
  const { path, options } = jsxNode
  if(t.isJSXFragment(path.node)) {
    const component = addVueImport(FRAGMENT)
    jsxNode.tag = t.identifier(component)
    jsxNode.tagType = ElementTypes.ELEMENT
    jsxNode.vnodeTag = FRAGMENT
    return;
  }
  const openingElementPath: NodePath<t.JSXOpeningElement> = (path as NodePath<t.JSXElement>).get('openingElement')
  const nameNode = openingElementPath.node.name
  let tagType = ElementTypes.ELEMENT

  if (t.isJSXIdentifier(nameNode)) {
    let tag = nameNode.name
    // parseTag in @vue/compiler-core pares.ts
    if(options.isNativeTag) {
      if (!options.isNativeTag(tag)) tagType = ElementTypes.COMPONENT
    } else if (
      isCoreComponent(tag) ||
      (options.isBuiltInComponent && options.isBuiltInComponent(tag)) ||
      /^[A-Z]/.test(tag) ||
      tag === 'component') {
      tagType = ElementTypes.COMPONENT
    }

    // keep with vue vnodeTag
    jsxNode.vnodeTag = resolveTag(tag)

    // reformat a-b to AB
    // but a does not turn to A
    if(tag.includes('-')) {
      tag = camelizeFirstWord(camelize(tag))
    }

    if(tagType === ElementTypes.COMPONENT) {
      if(isSymbol(jsxNode.vnodeTag)) {
        jsxNode.tag = t.identifier(addVueImport(jsxNode.vnodeTag))
      } else {
        jsxNode.tag = t.identifier(tag)
      }
    } else {
      jsxNode.tag = t.stringLiteral(tag)
    }
    jsxNode.tagType = tagType

    return;
  }

  if (t.isJSXMemberExpression(nameNode)) {
    // TODO: transformJSXMemberExpression
    // return transformJSXMemberExpression(t, namePath)
    return
  }

  throw new Error(`getTag: ${nameNode.type} is not supported`)
}
