import {types as t} from '@babel/core';
import jsxNode from '../jsxNode';
import {vueImportMap} from '../addVueImport';
import {WITH_DIRECTIVES,helperNameMap} from '../util/constant'
import {importTransform} from './generateCode';

export default function(block: t.CallExpression | t.SequenceExpression): t.CallExpression | t.SequenceExpression{
  if(jsxNode.directiveTransformResult?.length) {
    vueImportMap.push(WITH_DIRECTIVES)
    return t.callExpression(
      t.identifier(importTransform(helperNameMap[WITH_DIRECTIVES])),
      [block, t.arrayExpression(jsxNode.directiveTransformResult)]
    )
  } else {
    return block
  }
}
