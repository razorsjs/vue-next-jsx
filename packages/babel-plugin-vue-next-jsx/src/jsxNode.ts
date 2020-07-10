/**
 * model for a jsxElement: more like Vue TransformContext
 */

import { NodePath, types as t } from '@babel/core';
import { NodeTypes, ElementTypes } from './util/constant'
import domOptions from './domOptions'

// AttributeNode: @vue/compiler-core AttributeNode
export interface AttributeNode {
  type: NodeTypes.ATTRIBUTE
  name: string
  value: any
}

// DirectiveNode: @vue/compiler-core DirectiveNode
// name: arg.modifiers = exp
export interface DirectiveNode {
  type: NodeTypes.DIRECTIVE
  name: string
  exp?: any
  arg?: any
  modifiers?: string[]
}

export interface JsxNode  {
  // plugin options
  options?: PluginOptions

  // current JSXElement Path
  path?: NodePath<t.JSXElement>
  // nodeType: equal with @vue/compiler-core NodeTypes
  nodeType?: NodeTypes
  // tagType: equal with @vue/compiler-core ElementTypes
  // ElementTypes.Slot and ElementTypes.Template will not be supported(we don't need v-slot)
  tagType?: ElementTypes

  // just concat attrs and dirs
  props?: Array<AttributeNode | DirectiveNode>
  attributes?: Array<AttributeNode>
  directives?: Array<DirectiveNode>
  // spread props like {...obj}
  spreadProps?: Array<t.SpreadElement>

  // for createVNode
  // tag: first argument for createVNode
  tag?: t.StringLiteral | t.Identifier
  // children: third argument for createVNode
  children?: Array<any>,
  // patchFlags: fourth argument for createVNode
  patchFlag?: number,
  // dynamicProps: fifth argument for createVNode
  dynamicProps?: Array<string | undefined>
}

export interface BuildOptions {
  /**
   * e.g. build jsxNode to babel
   * @param node
   */
  build(node: JsxNode): t.ExpressionStatement | t.CallExpression
}

export interface ParseOptions {
  /**
   * e.g. use for judging directive
   * @param attr
   */
  isDirective?(attr: string): boolean
  /**
   * e.g. platform native elements, e.g. <div> for browsers
   */
  isNativeTag?: (tag: string) => boolean
  isBuiltInComponent?: (tag: string) => boolean
}

export type PluginOptions = BuildOptions & ParseOptions

let jsxNode: JsxNode = {}

export function clear() {
  Object.keys(jsxNode).forEach(key => delete jsxNode[key])
}

export function jsxNodeInit(path: NodePath<t.JSXElement>, options: PluginOptions) {
  clear()
  jsxNode.path = path
  jsxNode.options = {
    ...domOptions,
    ...options
  }
  jsxNode.attributes = []
  jsxNode.directives = []
  jsxNode.spreadProps = []
}

export default jsxNode
