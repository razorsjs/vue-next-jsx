/**
 * tools for building vue render function
 */
import { types as t } from '@babel/core';
import { generateBlock, generateCall } from './gen/generateCode';
import jsxNode, { JsxNode } from './jsxNode';
import { ElementTypes, CREATE_VNODE, CREATE_TEXT, MERGE_PROPS, PatchFlags, KEEP_ALIVE, TELEPORT, FRAGMENT } from './util/constant';
import { buildArrayToArrow, buildObjectToExpression } from './util/build';
import { isText, isTextVNode, isVNode, isRoot, shouldUseBlock } from './util';
import genDirective from './gen/genDirective';
import { addVueImport } from './addVueImport';

// main
export const build = (node: JsxNode): t.SequenceExpression | t.CallExpression | t.ArrayExpression => {
  const {path, tag, children, dynamicProps} = node
  const args: any = [tag]
  const data = buildData(node)
  if(dynamicProps?.length || node.patchFlag || children?.length || !t.isNullLiteral(data)) {
    args.push(data)
  }
  if(dynamicProps?.length || node.patchFlag || children?.length ) {
    args.push(buildChildren(node))
  }
  if(dynamicProps?.length || node.patchFlag) {
    args.push(node.patchFlag ? t.numericLiteral(node.patchFlag) : t.nullLiteral())
  }
  if(dynamicProps?.length) {
    args.push(t.arrayExpression(dynamicProps.map(i=>t.stringLiteral(i))))
  }
  // In root we generate block, else vnode
  // A jsxElement with no jsxElement parent will be treated as root
  // If has directive, wrap with _withDirective
  const useBlock = shouldUseBlock(node)
  let codeBlock: t.SequenceExpression | t.CallExpression | t.ArrayExpression = (isRoot(path) || useBlock) ? generateBlock(args) : generateCall(args, CREATE_VNODE)
  if(t.isArrowFunctionExpression(path.parent)) {
    codeBlock = t.arrayExpression([codeBlock])
  }
  return genDirective(codeBlock)
}

// build data for createVNode
export const buildData = (node: JsxNode): t.NullLiteral | t.ObjectExpression | t.CallExpression => {
  const {attributes, spreadProps} = node
  if(attributes.length === 0 && spreadProps.length === 0 ) {
    return t.nullLiteral()
  }
  // if has spread child, we use mergeProps
  if(spreadProps?.length) {
    const props = [...attributes,...spreadProps]
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
  // if children is object, assume that slotScope
  let isSlotScope = false
  const children = node.children.map(child => {
    if(t.isObjectExpression(child) && child.properties) {
      isSlotScope = true
    }
    return isText(child) ? generateCall([child], CREATE_TEXT) : child
  })
  if(isSlotScope) {
    const _ = t.objectProperty(t.identifier('_'), t.numericLiteral(1))
    return t.objectExpression([...children[0].properties, _])
  } else {
    const slot = {
      default: buildArrayToArrow(children),
      _: t.numericLiteral(1),
    }
    return buildObjectToExpression(slot)
  }
}

/**
 * build children for createVNode
 * contains slotChildren for component and normal children for dom
 * @param node
 */
export const buildChildren = (node: JsxNode): t.NullLiteral | t.CallExpression | t.StringLiteral | t.ArrayExpression | t.ObjectExpression => {
  // no children
  if(!node.children?.length) return t.nullLiteral()
  let {children: nodes, vnodeTag} = node;
  // if component node and has slot
  // Fragment treated as ELEMENT
  const isComponent = node.tagType === ElementTypes.COMPONENT
  if(vnodeTag === KEEP_ALIVE) {
    node.patchFlag|=PatchFlags.DYNAMIC_SLOTS
  }
  if(vnodeTag === TELEPORT || vnodeTag === FRAGMENT) {
    nodes = nodes.map(node => {
      if(t.isStringLiteral(node)) {
        return generateCall([node], CREATE_TEXT)
      } else {
        return node
      }
    })
  }
  const shouldBuildAsSlots =
    isComponent &&
    // Teleport is not a real component and has dedicated runtime handling
    vnodeTag !== TELEPORT &&
    // explained above.
    vnodeTag !== KEEP_ALIVE
  if(shouldBuildAsSlots) {
    return buildSlotChildren(node)
  }

  if(nodes.length === 1) {
    if(isVNode(nodes[0])) {
      return t.arrayExpression(nodes)
    }
    // only one
    return nodes[0]
  } else if (nodes.length === 0) {
    // no children
    return t.nullLiteral()
  } else {
    return t.arrayExpression(nodes)
  }
}
