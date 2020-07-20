import vShow from './vShow';
import { types as t } from '@babel/core';
import { DirectiveNode, DirectiveTransformResult, JsxNode } from '../jsxNode';
import vText from './vText';
import vHtml from './vHtml';
import vIs from './vIs';
import vOn from './vOn'

export const defaultTransform = (dir: DirectiveNode, node: JsxNode): DirectiveTransformResult => {
  return {
    props: [
      t.identifier(dir.name),
      dir.exp
    ]
  }
}
export default {
  show: vShow,
  text: vText,
  html: vHtml,
  is: vIs,
  on: vOn
}
