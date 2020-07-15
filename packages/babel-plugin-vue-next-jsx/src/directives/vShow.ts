import { DirectiveNode, DirectiveTransformResult, JsxNode } from '../jsxNode';
import { types as t } from '@babel/core';
import {V_SHOW} from '../util/constant'
import { getName } from '../addVueImport';

export default (dir: DirectiveNode, node: JsxNode): DirectiveTransformResult => {
  return {
    props: [
      t.identifier(getName(V_SHOW)),
      dir.exp
    ],
    needRuntime: V_SHOW
  }
}
