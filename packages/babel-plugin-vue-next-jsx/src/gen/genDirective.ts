import {types as t} from '@babel/core';
import jsxNode from '../jsxNode';
import {addVueImport} from '../addVueImport';
import {WITH_DIRECTIVES} from '../util/constant'

export default function(block: t.CallExpression | t.SequenceExpression | t.ArrayExpression): t.CallExpression | t.SequenceExpression | t.ArrayExpression{
  if(jsxNode.directiveTransformResult?.length) {
    const name = addVueImport(WITH_DIRECTIVES)
    return t.callExpression(
      t.identifier(name),
      [block, t.arrayExpression(jsxNode.directiveTransformResult)]
    )
  } else {
    return block
  }
}
