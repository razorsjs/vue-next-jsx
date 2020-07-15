/**
 * manage and generate fragments: import {} from 'vue'
 */
import {NodePath, types as t} from '@babel/core'
import {helperNameMap} from './util/constant'
import {importTransform} from './gen/generateCode';
import jsxNode from './jsxNode';

const findVueImport = (arr: Array<t.Statement>): t.ImportDeclaration | void => {
  for(let s of arr) {
    if(t.isImportDeclaration(s) && s.source.value === 'vue') {
      return s
    }
  }
}

export const getName = (name: any) => {
  return importTransform(helperNameMap[name])
}

const addNamed = (name, source, isRenamed?: boolean): string => {
  const program: NodePath<t.Program> = jsxNode.program as NodePath<t.Program>
  const body: Array<t.Statement> = program.node.body
  const resultName = isRenamed ? importTransform(name) : name
  // find source
  const vueImport = findVueImport(body)
  const specifier = t.importSpecifier(t.identifier(isRenamed?resultName:name), t.identifier(name))
  if(vueImport) {
    const _vueImport = vueImport as t.ImportDeclaration;
    if(_vueImport.specifiers.every(i=>{
      if(t.isImportSpecifier(i)) {
        return i.imported.name !== name
      }
      return false
    })) {
      _vueImport.specifiers.push(specifier)
    }
  } else {
    const importDeclaration = t.importDeclaration([specifier],t.stringLiteral('vue'))
    body.unshift(importDeclaration)
  }
  return resultName
}

export function addVueImport(name: symbol): string {
  const importName = helperNameMap[name]
  return addNamed(importName, 'vue', true)
}
