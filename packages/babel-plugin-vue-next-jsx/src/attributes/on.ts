import { AttributeNode, DirectiveNode, JsxNode } from '../jsxNode';
import { capitalize, hyphenate, NodeTypes, V_ON_WITH_MODIFIERS } from '../util/constant';
import {types as t} from '@babel/core'
import { addVueImport } from '../addVueImport';
import { resolveModifierValue } from '../util/resolveModifiers';

// onXxx
export default (name: string, value: any, jsxNode: JsxNode) => {
  // value can be array [value, modifiers]
  const arg = capitalize(name.substring(2))
  let exp, modifiers;
  if(t.isArrayExpression(value)) {
    exp = value.elements[0]
    modifiers = value.elements[1]
  } else {
    exp = value
  }
  const directiveNode: DirectiveNode = {
    type: NodeTypes.DIRECTIVE,
    name: 'on',
    exp,
    arg,
    modifiers
  };
  jsxNode.directives.push(directiveNode);
}
