// transform createVNode to _createVNode
import { types as t } from '@babel/core';
import { CREATE_BLOCK, CREATE_TEXT, CREATE_VNODE, helperNameMap, OPEN_BLOCK } from './constant';
import { JsxNode } from './jsxNode';

export const importTransform = (s) => `_${s}`

export const generateBlock = (args) => {
  const _openBlock = t.identifier(importTransform(helperNameMap[OPEN_BLOCK]));
  const _createBlock = t.identifier(importTransform(helperNameMap[CREATE_BLOCK]));
  const openCall =  t.callExpression(_openBlock, [])
  const creatCall = t.callExpression(_createBlock, args)
  const sequence = t.sequenceExpression([openCall, creatCall])
  return t.expressionStatement(sequence)
}

export const generateCreateVNode = (args): t.CallExpression => {
  const _createVNode = t.identifier(importTransform(helperNameMap[CREATE_VNODE]));
  return t.callExpression(_createVNode, args)
}

export const generateTextVNode = (args): t.CallExpression => {
  const _createTextVNode = t.identifier(importTransform(helperNameMap[CREATE_TEXT]));
  return t.callExpression(_createTextVNode, args)
}

/**
 * Transform attributes to ObjectExpression
 * @param attributes Object<[type: string]: ObjectExpression>
 * @param spread
 * @returns ObjectExpression
 */

const transformAttributes = (attributes, spread: Array<t.SpreadElement>): t.ObjectExpression => {
  const objectProperty: Array<t.ObjectProperty> = Object.entries(attributes).map(
    ([key, value]) => t.objectProperty(t.identifier(key), value as any),
  );
  // @ts-ignore
  return t.objectExpression(objectProperty.concat(spread));
};

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
