/**
 * gen tag from path
 */

import { NodePath, types as t } from '@babel/core';
import jsxNode from '../jsxNode';
import { ElementTypes, FRAGMENT, isSymbol, PatchFlags, camelize, capitalize } from '../util/constant';
import { addVueImport } from '../addVueImport';
import {isCoreComponent} from '../util'
import { resolveComponent } from '../util/resolveComponent';

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

const transformJSXMemberExpression = (node: t.JSXMemberExpression): t.MemberExpression => {
  const getObj = (member: t.JSXMemberExpression | t.JSXIdentifier): t.MemberExpression | t.Identifier => {
    if(t.isJSXMemberExpression(member)) {
      return t.memberExpression(getObj(member.object),t.identifier(member.property.name))
    } else {
      return t.identifier(member.name)
    }
  }
  const object = getObj(node.object)
  const property = node.property
  return t.memberExpression(object, t.identifier(property.name))
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

    if(tagType === ElementTypes.COMPONENT) {
      if(isSymbol(jsxNode.vnodeTag)) {
        jsxNode.tag = t.identifier(addVueImport(jsxNode.vnodeTag))
      } else {
        jsxNode.tag = resolveComponent(tag)
      }
    } else {
      jsxNode.tag = t.stringLiteral(tag)
    }
    jsxNode.tagType = tagType

    return;
  }

  if (t.isJSXMemberExpression(nameNode)) {
    jsxNode.tag = transformJSXMemberExpression(nameNode)
    return
  }

  throw new Error(`getTag: ${nameNode.type} is not supported`)
}
