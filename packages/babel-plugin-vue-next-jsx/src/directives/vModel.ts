import { DirectiveNode, DirectiveTransformResult, JsxNode } from '../jsxNode';
import { types as t } from '@babel/core';
import {
  V_MODEL_TEXT,
  V_MODEL_DYNAMIC,
  V_MODEL_RADIO,
  V_MODEL_CHECKBOX,
  V_MODEL_SELECT,
  NodeTypes,
  createDOMCompilerError,
  DOMErrorCodes,
  ElementTypes,
} from '../util/constant';
import { getName } from '../addVueImport';
import { getContent, isDynamic } from '../util';

const findProp = (node: JsxNode, prop: string) =>{
  return node.attributes.find(s => {
    const name = s.name
    return typeof name === 'string' ? prop === name : prop === getContent(name)
  })
}


export default (dir: DirectiveNode, node: JsxNode): DirectiveTransformResult => {
  const {vnodeTag: tag, options: {onError}, tagType} = node
  let directiveToUse = V_MODEL_TEXT
  const isComponent = tagType === ElementTypes.COMPONENT

  if(tag === 'input' || tag === 'textarea' || tag === 'select') {
    function checkDuplicatedValue() {
      const value = findProp(node, 'value')
      if (value) {
        onError(
          createDOMCompilerError(
            DOMErrorCodes.X_V_MODEL_UNNECESSARY_VALUE,
          )
        )
      }
    }
    const type = findProp(node, `type`)
    let isInvalidType = false

    // judge directiveToUse
    if(tag === 'input') {
      if(type) {
        // :type="foo"
        const {value} = type
        if(isDynamic(value)) {
          directiveToUse = V_MODEL_DYNAMIC
        } else if(t.isStringLiteral(value)) {
          switch (value.value) {
            case 'radio':
              directiveToUse = V_MODEL_RADIO
              break
            case 'checkbox':
              directiveToUse = V_MODEL_CHECKBOX
              break
            case 'file':
              isInvalidType = true
              onError(
                createDOMCompilerError(
                  DOMErrorCodes.X_V_MODEL_ON_FILE_INPUT_ELEMENT,
                )
              )
              break
            default:
              // text type
              checkDuplicatedValue()
              break
          }
        }
      }
    } else if(tag === 'select') {
      directiveToUse = V_MODEL_SELECT
    } else if (tag === 'textarea') {
      checkDuplicatedValue()
    }
  } else if(!isComponent){
    onError(createDOMCompilerError(
      DOMErrorCodes.X_V_MODEL_ON_INVALID_ELEMENT,
    ))
  }

  let {arg, exp, modifiers, index} = dir

  // parse modifiers and name
  let name: any = 'onUpdate:modelValue'
  let argParam = t.unaryExpression('void', t.numericLiteral(0))
  let hasArg = false

  if(arg && !t.isNullLiteral(arg)) {
    if(!isComponent) {
      onError(
        createDOMCompilerError(
          DOMErrorCodes.X_V_MODEL_ARG_ON_ELEMENT,
        )
      )
    }
    hasArg = true
    name = `onUpdate:${getContent(arg)}`
    argParam = arg
  }
  if(modifiers) {
    // transforms to {}
    if(t.isArrayExpression(modifiers)) {
      (modifiers as any) = t.objectExpression(modifiers.elements.map(i=>{
        return t.objectProperty(t.identifier(getContent(i)), t.booleanLiteral(true))
      }))
    }
  }
  let value = t.arrowFunctionExpression(
    [t.identifier('$event')],
    t.parenthesizedExpression(t.assignmentExpression('=', t.identifier('model'), t.identifier('$event'))))

  if(isComponent) {
    node.attributes.push({
      type: NodeTypes.ATTRIBUTE,
      name: hasArg ? getContent(arg) : 'modelValue',
      value: exp,
      index
    })
    // main
    node.attributes.push({
      type: NodeTypes.ATTRIBUTE,
      name,
      value,
      index,
      stringLiteral: true
    })
    if(modifiers) {
      node.attributes.push({
        type: NodeTypes.ATTRIBUTE,
        name: `${hasArg ? getContent(arg) : 'model'}Modifiers`,
        value: modifiers,
        index,
        static: true
      })
    }
  } else {
    node.attributes.push({
      type: NodeTypes.ATTRIBUTE,
      name,
      value,
      index,
      stringLiteral: true
    })
    // return directive
    const directiveResult = {
      props: [
        t.identifier(getName(directiveToUse)),
        exp
      ],
      needRuntime: directiveToUse
    }

    if(modifiers) {
      directiveResult.props.push(argParam)
      directiveResult.props.push(modifiers)
    } else if(hasArg) {
      directiveResult.props.push(argParam)
    }
    return directiveResult
  }
}
