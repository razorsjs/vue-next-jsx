/**
 * gen props, directives, attrs, spreadProps from path
 */

import { NodePath, types as t } from '@babel/core';
import { extractPatchFlag } from '../patchFlag';
import jsxNode, { DirectiveNode, AttributeNode } from '../jsxNode';
import { NodeTypes } from '../util/constant';

const parsePropsFromJSXAttribute = (path: NodePath<t.JSXAttribute>) => {
  // tsx does't support JSXNamespacedName, so only JSXIdentifier
  const nameNode: t.JSXIdentifier = path.node.name as t.JSXIdentifier;
  const name = nameNode.name;
  const { options: { isDirective } } = jsxNode;

  let value: any = path.node.value;
  if (value) {
    if (t.isJSXExpressionContainer(value)) {
      value = value.expression;
    }
  } else {
    value = t.booleanLiteral(true);
  }
  if (isDirective(name)) {
    const directiveNode: DirectiveNode = {
      type: NodeTypes.DIRECTIVE,
      name: name.split('-')[1],
      exp: value,
    };
    jsxNode.directives.push(directiveNode);
    return directiveNode
  } else {
    const attributeNode: AttributeNode = {
      type: NodeTypes.ATTRIBUTE,
      name,
      value,
    };
    jsxNode.attributes.push(attributeNode);
    jsxNode.props.push(attributeNode)
    return attributeNode
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
      jsxNode.props.push(node)
    }
  });

  if (jsxNode.directives?.length || jsxNode.attributes?.length) {
    extractPatchFlag();
  }
}
