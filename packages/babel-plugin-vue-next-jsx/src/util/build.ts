import {types as t} from '@babel/core'

// build [] to () => []
export const buildArrayToArrow = (arr: Array<t.Expression>): t.ArrowFunctionExpression => {
  return t.arrowFunctionExpression([], t.arrayExpression(arr))
}

// build object to ObjectExpression
export const buildObjectToExpression = (obj: {[name: string]: t.Expression}): t.ObjectExpression => {
  return t.objectExpression(Object.keys(obj).map(key => {
    return t.objectProperty(t.identifier(key), obj[key])
  }))
}
