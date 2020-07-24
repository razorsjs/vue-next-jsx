/**
 * model for a jsxElement: more like Vue TransformContext
 */

import { NodePath, types as t } from '@babel/core';
import { NodeTypes, ElementTypes, extend, CompilerError } from './util/constant';
import domOptions from './domOptions'

// AttributeNode: @vue/compiler-core AttributeNode
export interface AttributeNode {
  type: NodeTypes.ATTRIBUTE
  name: string | t.Expression
  value: any,
  // the origin index in jsx, used to sort and merge
  index: number
  // static means value is transformed, and the origin is static for patchFlags, such as style
  static?: boolean
  // Force key to stringLiteral, like 'a-d': value
  stringLiteral?: boolean
}

// DirectiveNode: @vue/compiler-core DirectiveNode
// name: arg.modifiers = exp
export interface DirectiveNode {
  type: NodeTypes.DIRECTIVE
  name: string
  // the origin index in jsx, used to sort and merge
  index: number
  exp?: any
  arg?: any
  modifiers?: t.ArrayExpression
}

export interface JsxNode  {
  // plugin options
  options?: PluginOptions
  // current JSXElement Path
  path?: NodePath
  // current program
  program?: NodePath
  // record special expression like vue import
  extraExpression?: {
    vueImport?: t.ImportDeclaration
    optimizeVariables?: any
  }

  // tagType: equal with @vue/compiler-core ElementTypes
  // ElementTypes.Slot and ElementTypes.Template will not be supported(we don't need v-slot)
  tagType?: ElementTypes
  // vnodeTag
  vnodeTag?: symbol | string

  attributes?: Array<AttributeNode>
  directives?: Array<DirectiveNode>
  // spread props like {...obj}
  spreadProps?: Array<t.SpreadElement>

  // for createVNode
  // tag: first argument for createVNode
  tag?: t.Expression
  // children: third argument for createVNode
  children?: Array<any>,
  // patchFlags: fourth argument for createVNode
  patchFlag?: number,
  // dynamicProps: fifth argument for createVNode
  dynamicProps?: Array<string | undefined>
  // an array used to build directives, generated in patchFlag
  directiveTransformResult?: Array<t.ArrayExpression>
}

export type DirectiveTransform = (
  dir: DirectiveNode,
  node: JsxNode
) => DirectiveTransformResult | void

export interface CodegenOptions {
  /**
   * Option to optimize helper import bindings via variable assignment
   * (only used for webpack code-split)
   * @default false
   */
  optimizeImports?: boolean
  /**
   * Customize where to import runtime helpers from.
   * @default 'vue'
   */
  runtimeModuleName?: string
}

export interface DirectiveTransformResult {
  props: t.Expression[]
  needRuntime?: boolean | symbol
}

/**
 * name: jsx name
 * value: jsx exp
 * index: jsx attribute index in all attributes
 * node: current node
 */
export type AttributeTransform = (name: string, value: t.Expression | t.BooleanLiteral, index: number, node: JsxNode) => void

export interface BuildOptions {
  /**
   * e.g. build jsxNode to babel
   * @param node
   */
  build(node: JsxNode): t.SequenceExpression | t.CallExpression
}

export interface ParseOptions {
  /**
   * e.g. platform native elements, e.g. <div> for browsers
   */
  isNativeTag?: (tag: string) => boolean
  isBuiltInComponent?: (tag: string) => symbol | void
  /**
   * An object of { name or regexp : parser } to be applied to jsx attribute
   */
  attributeParse?: Map<string | RegExp, AttributeTransform | undefined>
  /**
   * An function will be applied to every directiveNode, used to modify dir or other thing
   * @param dir
   */
  directiveParse?: (dir: DirectiveNode) => void
}

export interface TransformOptions {
  /**
   * An object of { name: transform } to be applied to every directive attribute
   * node found on element nodes.
   */
  directiveTransforms?: Record<string, DirectiveTransform | undefined>
  /**
   * Hoist static VNodes and props objects to `_hoisted_x` constants
   * @default false
   */
  hoistStatic?: boolean
  /**
   * Cache v-on handlers to avoid creating new inline functions on each render,
   * also avoids the need for dynamically patching the handlers by wrapping it.
   * e.g `@click="foo"` by default is compiled to `{ onClick: foo }`. With this
   * option it's compiled to:
   * ```js
   * { onClick: _cache[0] || (_cache[0] = e => _ctx.foo(e)) }
   * ```
   * - Requires "prefixIdentifiers" to be enabled because it relies on scope
   * analysis to determine if a handler is safe to cache.
   * @default false
   */
  cacheHandlers?: boolean,
  onError?: (error: CompilerError) => void
}

export type PluginOptions = BuildOptions & ParseOptions & TransformOptions & CodegenOptions

let jsxNode: JsxNode = {}

export function clear() {
  Object.keys(jsxNode).forEach(key => delete jsxNode[key])
}

export function jsxNodeInit(path: NodePath, options: PluginOptions, program: NodePath) {
  clear()
  jsxNode.path = path
  jsxNode.program = program
  jsxNode.options = extend({}, domOptions, options)
  jsxNode.patchFlag = 0
  jsxNode.attributes = []
  jsxNode.directives = []
  jsxNode.spreadProps = []
  jsxNode.dynamicProps = []
  jsxNode.extraExpression = {}
}

export default jsxNode
