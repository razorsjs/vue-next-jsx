import {types as t} from '@babel/core'

// build [] to () => []
export const buildArrayToArrow = (arr: Array<t.Expression>): t.ArrowFunctionExpression => {
  return t.arrowFunctionExpression([], t.arrayExpression(arr))
}

// build plain object to ObjectExpression
export const buildPlainObjectToExpression = (obj: {[name: string]: string | number}): t.ObjectExpression => {
  return t.objectExpression(Object.keys(obj).map(key => {
    return t.objectProperty(t.stringLiteral(key), t.stringLiteral(obj[key].toString()))
  }))
}


// build object to ObjectExpression
export const buildObjectToExpression = (obj: {[name: string]: t.Expression}): t.ObjectExpression => {
  return t.objectExpression(Object.keys(obj).map(key => {
    return t.objectProperty(t.identifier(key), obj[key])
  }))
}
