import { makeMap, V_ON_WITH_MODIFIERS, V_ON_WITH_KEYS, capitalize, CAPITALIZE } from './constant';
import {types as t} from '@babel/core'
import { getContent } from './index';
import { addVueImport } from '../addVueImport';
import is from '../attributes/is';

const isEventOptionModifier = /*#__PURE__*/ makeMap(`passive,once,capture`)
const isNonKeyModifier = /*#__PURE__*/ makeMap(
  // event propagation management
  `stop,prevent,self,` +
  // system modifiers + exact
  `ctrl,shift,alt,meta,exact,` +
  // mouse
  `middle`
)
// left & right could be mouse or key modifiers based on event type
const maybeKeyModifier = /*#__PURE__*/ makeMap('left,right')
const isKeyboardEvent = /*#__PURE__*/ makeMap(
  `onkeyup,onkeydown,onkeypress`,
  true
)

export const isStaticExp = (exp): exp is string => {
  return typeof exp === 'string'
}

export const transformClick = (key: string | t.Expression, event: string) => {
  const isStaticClick =
    isStaticExp(key) && key.toLowerCase() === 'onclick'
  // If dynamic, return a ternary operator
  if(isStaticClick) {
    return event
  } else {
    const compoundName = t.binaryExpression('+', t.stringLiteral('on'), t.callExpression(t.identifier(addVueImport(CAPITALIZE)),[t.identifier('event')]));
    return t.conditionalExpression(
      t.binaryExpression('===', compoundName, t.stringLiteral('onClick')),
      t.stringLiteral(event),
      compoundName
    )
  }
}

// @vue/compiler-dom resolveModifiers
export const resolveModifiers = (key: string | t.Expression, modifiers: string[]) => {
  const keyModifiers = []
  const nonKeyModifiers = []
  const eventOptionModifiers = []

  for (let i = 0; i < modifiers.length; i++) {
    const modifier = modifiers[i]

    if (isEventOptionModifier(modifier)) {
      // eventOptionModifiers: modifiers for addEventListener() options,
      // e.g. .passive & .capture
      eventOptionModifiers.push(modifier)
    } else {
      // runtimeModifiers: modifiers that needs runtime guards
      if (maybeKeyModifier(modifier)) {
        if (isStaticExp(key)) {
          if (isKeyboardEvent((key as string))) {
            keyModifiers.push(modifier)
          } else {
            nonKeyModifiers.push(modifier)
          }
        } else {
          keyModifiers.push(modifier)
          nonKeyModifiers.push(modifier)
        }
      } else {
        if (isNonKeyModifier(modifier)) {
          nonKeyModifiers.push(modifier)
        } else {
          keyModifiers.push(modifier)
        }
      }
    }
  }

  return {
    keyModifiers,
    nonKeyModifiers,
    eventOptionModifiers
  }
}

/**
 * return formatted key and value
 * @param key
 * @param value
 * @param modifiers
 */
export const resolveModifierValue = (key: string | t.Expression, value, modifiers: t.ArrayExpression) => {
  if(modifiers) {
    const {
      keyModifiers,
      nonKeyModifiers,
      eventOptionModifiers
    } = resolveModifiers(key, modifiers.elements.map(i=>getContent(i)))
    if (nonKeyModifiers.includes('right')) {
      key = transformClick(key, `onContextmenu`)
    }
    if (nonKeyModifiers.includes('middle')) {
      key = transformClick(key, `onMouseup`)
    }
    if (nonKeyModifiers.length) {
      value = t.callExpression(t.identifier(addVueImport(V_ON_WITH_MODIFIERS)), [
        value,
        t.arrayExpression(nonKeyModifiers.map(i=>t.stringLiteral(i)))
      ])
    }
    if (
      keyModifiers.length &&
      // if event name is dynamic, always wrap with keys guard
      (!isStaticExp(key) || isKeyboardEvent(key as string))
    ) {
      value = t.callExpression(t.identifier(addVueImport(V_ON_WITH_KEYS)), [
        value,
        t.arrayExpression(keyModifiers.map(i=>t.stringLiteral(i)))
      ])
    }
    if (eventOptionModifiers.length) {
      const modifierPostfix = eventOptionModifiers.map(capitalize).join('')
      key = isStaticExp(key)
        ? `${key}${modifierPostfix}`
        : key
    }
  }
  return {
    key,
    value
  }
}

