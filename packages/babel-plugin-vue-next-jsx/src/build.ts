/**
 * tools for building vue render function
 */
import { types as t } from '@babel/core';
import { generateBlock, generateCall } from './gen/generateCode';
import jsxNode, { JsxNode } from './jsxNode';
import { ElementTypes, CREATE_VNODE, CREATE_TEXT, TO_DISPLAY_STRING, PatchFlags } from './util/constant';
import { buildArrayToArrow, buildObjectToExpression } from './util/build';
import { isText, isTextVNode, isVNode } from './util';
import genDirective from './gen/genDirective';

// main
export const build = (node: JsxNode): t.SequenceExpression | t.CallExpression => {
  const {path, tag, children, patchFlag, dynamicProps} = node
  const args: any = [tag]
  const data = buildData(node)
  if(dynamicProps?.length || patchFlag || children?.length || !t.isNullLiteral(data)) {
    args.push(data)
  }
  if(dynamicProps?.length || patchFlag || children?.length ) {
    args.push(buildChildren(node))
  }
  if(dynamicProps?.length || patchFlag) {
    args.push(patchFlag ? t.numericLiteral(patchFlag) : t.nullLiteral())
  }
  if(dynamicProps?.length) {
    args.push(t.arrayExpression(dynamicProps.map(i=>t.stringLiteral(i))))
  }
  // In root we generate block, else vnode
  // A jsxElement with no jsxElement parent will be treated as root
  // If has directive, wrap with _withDirective
  const codeBlock = t.isJSXElement(path.parent) ? generateCall(args, CREATE_VNODE) : generateBlock(args)
  return genDirective(codeBlock)
}

// build data for createVNode
export const buildData = (node: JsxNode): t.NullLiteral | t.ObjectExpression => {
  const {attributes, spreadProps} = node
  if(attributes.length === 0 && spreadProps.length === 0) {
    return t.nullLiteral()
  }
  const objectProperty: Array<t.ObjectProperty> = attributes.map(attr => {
    return t.objectProperty(t.identifier(attr.name), attr.value)
  })
  // @ts-ignore
  return t.objectExpression(objectProperty.concat(spreadProps));
}

/**
 * build slot children like
 * {
 *   default: () => [_createTextVNode('123')],
 *   slot1: () => []
 * }
 * @param node
 */
export const buildSlotChildren = (node: JsxNode): t.ObjectExpression => {
  const children = node.children.map(child => isText(child) ? generateCall([child], CREATE_TEXT) : child)
  const defaultValue = buildArrayToArrow(children)
  const slot = {
    default: defaultValue,
    _: t.numericLiteral(1)
  }
  return buildObjectToExpression(slot)
}

/**
 * build children for createVNode
 * contains slotChildren for component and normal children for dom
 * @param node
 */
export const buildChildren = (node: JsxNode): t.NullLiteral | t.CallExpression | t.StringLiteral | t.ArrayExpression | t.ObjectExpression => {
  // no children
  if(!node.children?.length) return t.nullLiteral()
  const {children: nodes} = node;
  // if component node and has slot
  const isComponent = node.tagType === ElementTypes.COMPONENT
  if(isComponent) {
    return buildSlotChildren(node)
  }

  if(nodes.length === 1 && !isVNode(nodes[0])) {
    // only one
    return nodes[0]
  } else if (nodes.length === 0) {
    // no children
    return t.nullLiteral()
  } else {
    return t.arrayExpression(nodes)
  }
}
