/**
 * tools for building vue render function
 */
import { types as t } from '@babel/core';
import { generateBlock, generateCreateVNode, generateTextVNode } from './generateCode';
import { JsxNode } from './jsxNode';

// main
export const build = (node: JsxNode): t.ExpressionStatement | t.CallExpression => {
  const {path, tag, children, patchFlags} = node
  const args: any = [tag]
  if(children.length !== 0) {
    // data
    args.push(buildData(node))
    args.push(buildChildren(node))
    if(patchFlags) {
      args.push(t.numericLiteral(patchFlags))
    }
  }
  // in root we generate block, else vnode
  if(t.isJSXElement(path.parent)) {
    return generateCreateVNode(args)
  } else {
    return generateBlock(args)
  }
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

// build children for createVNode
export const buildChildren = (node: JsxNode): null | t.StringLiteral | t.ArrayExpression => {
  let nodes = node.children
  if(nodes.length === 1 && t.isStringLiteral(nodes[0])) {
    // only one
    return nodes[0]
  } else if (nodes.length === 0) {
    // no children
    return null
  } else {
    // wrap string children with _createTextVNode
    for(let i=0;i<nodes.length;i++){
      const node = nodes[i]
      if(t.isStringLiteral(node)) {
        nodes[i] = generateTextVNode([node])
      }
    }
    return t.arrayExpression(nodes)
  }
}
