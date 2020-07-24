/**
 * gen props, directives, attrs, spreadProps from path
 */

import { NodePath, types as t } from '@babel/core';
import { extractPatchFlag } from '../patchFlag';
import jsxNode, { DirectiveNode, AttributeNode, DirectiveTransform } from '../jsxNode';
import { NodeTypes } from '../util/constant';
import {defaultAttrParse} from '../attributes';

const parsePropsFromJSXAttribute = (path: NodePath<t.JSXAttribute>, index: number) => {
  // tsx does't support JSXNamespacedName, so only JSXIdentifier
  const nameNode: t.JSXIdentifier = path.node.name as t.JSXIdentifier;
  const name = nameNode.name;
  const { options: {attributeParse} } = jsxNode;

  let value: any = path.node.value;
  if (value) {
    if (t.isJSXExpressionContainer(value)) {
      value = value.expression;
    }
  } else {
    value = t.booleanLiteral(true);
  }

  let attrParse;
  attributeParse.forEach(function(value, key) {
    if(key === name) {
      attrParse = value
    }
    if(key instanceof RegExp && key.test(name)) {
      key.lastIndex = 0
      attrParse = value
    }
  });
  if(attrParse) {
    attrParse(name, value, index, jsxNode)
  } else {
    defaultAttrParse(name, value, index, jsxNode)
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

  paths.forEach((path, index) => {
    if (path.isJSXAttribute()) {
      parsePropsFromJSXAttribute(path, index);
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
