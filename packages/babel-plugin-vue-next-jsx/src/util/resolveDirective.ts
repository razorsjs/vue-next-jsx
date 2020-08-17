import { types as t } from '@babel/core';
import { addVueImport } from '../addVueImport';
import { RESOLVE_DIRECTIVE, SupportedInnerDirectives } from './constant';
import { addVariable } from '../addVariable';

/**
 * Same strategy with component
 * resolve v-a-b to real dir name
 */

export const resolveDirective = (name: string): string => {
  const nameArr = name.split('-').slice(1)
  const dirName = nameArr.join('-')
  if(SupportedInnerDirectives[name]) return dirName
  const prefix = '_directive_'
  const variableName = prefix + nameArr.join('_')
  const declarator = t.variableDeclarator(
    t.identifier(variableName),
    t.callExpression(
      t.identifier(addVueImport(RESOLVE_DIRECTIVE)), [t.stringLiteral(dirName)])
  )
  addVariable(declarator, variableName)
  return variableName
}
