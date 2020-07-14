import { DirectiveNode, DirectiveTransformResult, JsxNode } from '../jsxNode';
import { types as t } from '@babel/core';
import {V_SHOW} from '../util/constant'
import { addVueImport } from '../addVueImport';

export default (dir: DirectiveNode, node: JsxNode): DirectiveTransformResult => {
  return {
    props: [
      t.identifier(addVueImport(V_SHOW)),
      dir.exp
    ],
    needRuntime: V_SHOW
  }
}
