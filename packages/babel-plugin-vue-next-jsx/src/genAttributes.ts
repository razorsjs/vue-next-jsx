import { types as t, NodePath} from '@babel/core';
import {extractPatchFlagFromAttrs} from './patchFlag'

const directiveKey = Symbol('directive')
const isDirective = (attr) => attr.startsWith('v-')

/**
 * Transform attributes to ObjectExpression
 * @param attributes Object<[type: string]: ObjectExpression>
 * @param spread
 * @returns ObjectExpression
 */

const transformAttributes = (attributes, spread: Array<t.SpreadElement>): t.ObjectExpression => {
  const objectProperty: Array<t.ObjectProperty> = Object.entries(attributes).map(
    ([key, value]) => t.objectProperty(t.identifier(key), value as any),
  );
  // @ts-ignore
  return t.objectExpression(objectProperty.concat(spread));
}

/**
 * get vue attribute from JSXAttribute
 * @param path
 * @param attributes
 */
const parseAttributeJSXAttribute = (path: NodePath<t.JSXAttribute>, attributes) => {
  // tsx does't support JSXNamespacedName, so only JSXIdentifier
  const nameNode: t.JSXIdentifier = path.node.name as t.JSXIdentifier
  const name = nameNode.name
  let value: any = path.node.value
  if(value) {
    if (t.isJSXExpressionContainer(value)) {
      value = value.expression
    }
  } else {
    value = t.booleanLiteral(true)
  }
  if(isDirective(name)) {
    attributes[directiveKey].push([name, value])
  } else {
    attributes[name] = value
  }
}

export type attrObject = {
  data?: t.ObjectExpression,
  directives?: Array<Array<[string, any]>>,
  patchFlags?: number,
  dynamicProps?: Array<any>
}

export default function(paths): t.NullLiteral | attrObject {
  // ts does't support symbol key
  let attributes: any = {
    [directiveKey]: [],
  }
  const spread: Array<t.SpreadElement> = []
  paths.forEach(path => {
    if(path.isJSXAttribute()) {
      parseAttributeJSXAttribute(path, attributes)
    }
    if (path.isJSXSpreadAttribute()) {
      spread.push(t.spreadElement(path.argument))
    }
  })
  const directives = attributes[directiveKey]
  delete attributes[directiveKey]

  const result: attrObject = {}

  if(Object.keys(attributes).length!==0) {
    extractPatchFlagFromAttrs(attributes, result)
    result.data = transformAttributes(attributes, spread)
  }
  if(directives.length!==0) {
    result.directives = directives
  }

  return Object.keys(result).length !==0 ? result : t.nullLiteral()
}
