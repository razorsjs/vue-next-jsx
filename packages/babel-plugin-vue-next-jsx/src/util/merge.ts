import { AttributeNode } from '../jsxNode';
import {types as t} from '@babel/core'

export const mergeProps = (dir: AttributeNode, target: AttributeNode) => {
  const currentValue = dir.value
  const {value} = target
  if(t.isArrayExpression(value)) {
    value.elements.push(currentValue)
  } else {
    target.value = t.arrayExpression([value, currentValue])
  }
  return target
}
