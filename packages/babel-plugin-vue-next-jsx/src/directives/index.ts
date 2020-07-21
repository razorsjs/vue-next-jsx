import vShow from './vShow';
import { types as t } from '@babel/core';
import { DirectiveNode, DirectiveTransformResult, JsxNode } from '../jsxNode';
import vText from './vText';
import vHtml from './vHtml';
import vIs from './vIs';
import vOn from './vOn'
import vModel from './vModel';

export const noopDirectiveTransform = () => {}

export const defaultDirectiveTransform = (dir: DirectiveNode, node: JsxNode): DirectiveTransformResult => {
  return {
    props: [
      t.identifier(dir.name),
      dir.exp
    ]
  }
}

export const directiveParse = (dir: DirectiveNode) => {
  // we do nothing in dir.name, just v-on or vOn, and move all logic in value
  // https://github.com/vuejs/jsx/issues/141#issuecomment-656648284
  // Implements for @bjarkihall's design
  // 1 parameters (value) v-model={[model]}
  // 2 parameters (name, value) v-model={['foo', model]}
  // 3 parameters (name, value, modifiers) v-model={['foo', model, ['a','b']]}
  const {exp} = dir
  if(t.isArrayExpression(exp)) {
    const {elements} = exp
    if(elements.length === 1) {
      dir.exp = elements[0]
    } else {
      dir.arg = elements[0]
      dir.exp = elements[1]
      dir.modifiers = elements[2] as any
    }
  }
}

export default {
  show: vShow,
  text: vText,
  html: vHtml,
  is: vIs,
  on: vOn,
  cloak: noopDirectiveTransform,
  model: vModel
}
