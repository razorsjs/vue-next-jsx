import { DirectiveNode, DirectiveTransformResult, JsxNode } from '../jsxNode';
import { types as t } from '@babel/core';
import {V_SHOW, helperNameMap} from '../util/constant'
import {importTransform} from '../gen/generateCode';

export default (dir: DirectiveNode, node: JsxNode): DirectiveTransformResult => {
  return {
    props: [
      t.identifier(importTransform(helperNameMap[V_SHOW])),
      dir.exp
    ],
    needRuntime: V_SHOW
  }
}
