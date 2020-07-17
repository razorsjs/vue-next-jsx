/**
 * gen props, directives, attrs, spreadProps from path
 */

import { NodePath, types as t } from '@babel/core';
import { extractPatchFlag } from '../patchFlag';
import jsxNode, { DirectiveNode, AttributeNode, DirectiveTransform } from '../jsxNode';
import { NodeTypes } from '../util/constant';
import {defaultAttrTransform} from '../attributes';

const parsePropsFromJSXAttribute = (path: NodePath<t.JSXAttribute>) => {
  // tsx does't support JSXNamespacedName, so only JSXIdentifier
  const nameNode: t.JSXIdentifier = path.node.name as t.JSXIdentifier;
  const name = nameNode.name;
  const { options: {attributeTransforms} } = jsxNode;

  let value: any = path.node.value;
  if (value) {
    if (t.isJSXExpressionContainer(value)) {
      value = value.expression;
    }
  } else {
    value = t.booleanLiteral(true);
  }

  let attrTrans;
  attributeTransforms.forEach(function(value, key) {
    if(key === name) {
      attrTrans = value
    }
    if(key instanceof RegExp && key.test(name)) {
      key.lastIndex = 0
      attrTrans = value
    }
  });
  if(attrTrans) {
    attrTrans(name, value, jsxNode)
  } else {
    defaultAttrTransform(name, value, jsxNode)
  }
};

/**
 * add jsxNode.props
 */
export default function(): void {
  const { path } = jsxNode;
  if(t.isJSXFragment(path.node)) return
  const openingElementPath: NodePath<t.JSXOpeningElement> = (path as NodePath<t.JSXElement>).get('openingElement');
  const paths = openingElementPath.get('attributes');

  paths.forEach(path => {
    if (path.isJSXAttribute()) {
      parsePropsFromJSXAttribute(path);
    }
    if (path.isJSXSpreadAttribute()) {
      let node = t.spreadElement(path.node.argument)
      jsxNode.spreadProps.push(node)
    }
  });

  if (jsxNode.directives?.length || jsxNode.attributes?.length) {
    extractPatchFlag();
  }
}
