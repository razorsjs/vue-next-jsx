/**
 * tools for building vue render function
 */
import { types as t } from '@babel/core';
import { generateBlock, generateCall } from './gen/generateCode';
import jsxNode, { JsxNode } from './jsxNode';
import { ElementTypes, CREATE_VNODE, CREATE_TEXT, MERGE_PROPS, PatchFlags } from './util/constant';
import { buildArrayToArrow, buildObjectToExpression } from './util/build';
import { isText, isTextVNode, isVNode, isLeaf } from './util';
import genDirective from './gen/genDirective';
import { addVueImport } from './addVueImport';

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
  const codeBlock = isLeaf(path) ? generateCall(args, CREATE_VNODE) : generateBlock(args)
  return genDirective(codeBlock)
}

// build data for createVNode
export const buildData = (node: JsxNode): t.NullLiteral | t.ObjectExpression | t.CallExpression => {
  const {attributes, spreadProps, props} = node
  if(props.length === 0) {
    return t.nullLiteral()
  }
  // if has spread child, we use mergeProps
  if(spreadProps?.length) {
    const name = addVueImport(MERGE_PROPS)
    const _props = props.map(i => {
      if(!t.isSpreadElement(i)) {
        return t.objectExpression([t.objectProperty(t.identifier(i.name), i.value)])
      } else {
        return t.objectExpression([i])
      }
    })
    return t.callExpression(t.identifier(name), _props)
  } else {
    // plain {}
    const objectProperty: Array<t.ObjectProperty> = attributes.map(attr => {
      return t.objectProperty(t.identifier(attr.name), attr.value)
    })
    return t.objectExpression(objectProperty);
  }
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
  // Fragment treated as ELEMENT
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
