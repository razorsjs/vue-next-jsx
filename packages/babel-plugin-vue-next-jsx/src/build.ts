/**
 * tools for building vue render function
 */
import { types as t } from '@babel/core';
import { generateBlock, generateCall } from './gen/generateCode';
import jsxNode, { JsxNode } from './jsxNode';
import {
  ElementTypes,
  CREATE_VNODE,
  CREATE_TEXT,
  MERGE_PROPS,
  PatchFlags,
  KEEP_ALIVE,
  TELEPORT,
  FRAGMENT,
  TRANSITION,
  SUSPENSE, BASE_TRANSITION,
} from './util/constant';
import { buildArrayToArrow, buildObjectToExpression } from './util/build';
import { isText, isTextVNode, isVNode, isRoot, shouldUseBlock } from './util';
import genDirective from './gen/genDirective';
import { addVueImport } from './addVueImport';

// main
export const build = (node: JsxNode): t.SequenceExpression | t.CallExpression | t.ArrayExpression => {
  const {path, tag, children, dynamicProps, options} = node
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
  // In no optimized mode, force to CREATE_VNODE, just a global fallback
  let codeBlock: t.SequenceExpression | t.CallExpression | t.ArrayExpression
  if(!options.optimized || node.mode === 'vnode') {
    codeBlock = generateCall(args, CREATE_VNODE)
  } else {
    if(node.mode === 'block') {
      codeBlock = generateBlock(args)
    } else {
      const useBlock = shouldUseBlock(node)
      codeBlock = (isRoot(path, node) || useBlock) ? generateBlock(args) : generateCall(args, CREATE_VNODE)
    }
  }

  // only works in slot literal
  if(t.isArrowFunctionExpression(path.parent)) {
    codeBlock = t.arrayExpression([codeBlock])
  }
  return genDirective(codeBlock)
}

export const buildDataName = (strOrExp, stringLiteral?: boolean): {
  exp: t.Identifier | t.StringLiteral |t.BinaryExpression,
  needComputed: boolean
} => {
  if(typeof strOrExp === 'string') {
    return {
      exp: stringLiteral ? t.stringLiteral(strOrExp) :t.identifier(strOrExp),
      needComputed: false
    }
  } else {
    return {
      exp: strOrExp,
      needComputed: true
    }
  }
}
// build data for createVNode
export const buildData = (node: JsxNode): t.NullLiteral | t.ObjectExpression | t.CallExpression | t.Identifier => {
  const {attributes, spreadProps} = node
  if(attributes.length === 0 && spreadProps.length === 0 ) {
    return t.nullLiteral()
  }
  // if has spread child, or no name attr, we use mergeProps
  let identifiers: Array<t.SpreadElement | t.ObjectExpression | t.Identifier> = [];
  let needMergeProps = false;
  if(attributes?.length) {
    attributes.forEach(attr => {
      if(attr.name) {
        const {exp, needComputed} = buildDataName(attr.name, attr.stringLiteral)
        identifiers.push(t.objectExpression([t.objectProperty(exp, attr.value, needComputed)]))
      } else {
        needMergeProps = true
        identifiers.push(attr.value)
      }
    })
  }
  if(spreadProps?.length) {
    identifiers = identifiers.concat(spreadProps.map(i=>t.objectExpression([i])));
    needMergeProps = true
  }
  if(needMergeProps) {
    // only one dynamic value such as only v-bind=[a], look at patchflag test full props
    if(identifiers.length === 1) return identifiers[0] as t.Identifier
    return t.callExpression(t.identifier(addVueImport(MERGE_PROPS)), identifiers)
  } else {
    // identifiers all ObjectExpression
    let properties = (identifiers as Array<t.ObjectExpression>).reduce((pre, item) => {
      return pre.concat(item.properties)
    }, [])
    return t.objectExpression(properties)
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
export const buildSlotChildren = (node: JsxNode): t.ObjectExpression | t.Identifier => {
  const {children, vnodeTag} = node
  // two ways to slotScope: function or object literal
  // only one function: as default slot
  if(children.length === 1) {
    const child = children[0]
    if(t.isIdentifier(child)) {
      return child
    } else if(t.isObjectExpression(child)) {
      const _ = t.objectProperty(t.identifier('_'), t.numericLiteral(1))
      return t.objectExpression([...children[0].properties, _])
    } else if(t.isFunctionExpression(child) || t.isArrowFunctionExpression(child)) {
      const _ = t.objectProperty(t.identifier('_'), t.numericLiteral(1))
      return t.objectExpression([t.objectProperty(t.identifier('default'), child), _])
    }
  }
  const _children = children.map(child => {
    return isText(child) ? generateCall([child], CREATE_TEXT) : child
  })
  const slot = {
    default: (_children.length === 1 && vnodeTag!==SUSPENSE && vnodeTag!==BASE_TRANSITION && vnodeTag!==TRANSITION) ? t.arrowFunctionExpression([], _children[0]) : buildArrayToArrow(_children),
    _: t.numericLiteral(1),
  }
  return buildObjectToExpression(slot)
}

/**
 * build children for createVNode
 * contains slotChildren for component and normal children for dom
 * @param node
 */
export const buildChildren = (node: JsxNode): t.Identifier | t.NullLiteral | t.CallExpression | t.StringLiteral | t.ArrayExpression | t.ObjectExpression => {
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
