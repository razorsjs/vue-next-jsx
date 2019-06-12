import { types as t } from '@babel/core';

export function buildLiteral(value: any, type: string) {
  switch (type) {
    case 'string':
      return t.stringLiteral(value);
    default:
      return t.stringLiteral(value);
  }
}

export function buildImportSpecifier(imported: string, local?: string) {
  const _local = local || imported;
  const importIdentifier = t.identifier(imported);
  const localIdentifier = t.identifier(_local);
  return t.importSpecifier(importIdentifier, localIdentifier);
}

export function insertImportDeclaration(body: Array<t.Statement>, importDeclaration: t.ImportDeclaration) {
  for (let i = 0; i < body.length; i++) {
    if (!t.isImportDeclaration(body[i])) {
      body.splice(i, 0, importDeclaration);
      return body;
    }
  }
}

const blackList: Array<string> = [];

export function inBlackList(obj: string) {
  return blackList.indexOf(obj) !== -1
}
