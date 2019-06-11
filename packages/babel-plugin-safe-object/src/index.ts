import { types as t, NodePath } from '@babel/core';
import { MemberExpression, Expression, AssignmentExpression, ImportDeclaration, ImportSpecifier } from '@babel/types';
import { buildImportSpecifier, buildLiteral, insertImportDeclaration } from './babel-util';
import global from './global';

function isSet(path: NodePath) {
  return t.isAssignmentExpression(path.parent) && path.parent.left === path.node;
}

function isMemberExpressionEnd(node: MemberExpression) {
  return !t.isMemberExpression(node.object)
}

function isInGlobal(node: MemberExpression) {
  return t.isIdentifier(node.object) && node.object.name in global
}
function isNeedConvert(node: MemberExpression) {
  return isMemberExpressionEnd(node) && !isInGlobal(node)
}

export default function() {
  let paths: Array<Expression> = [];
  let replaceRoot: any = null;
  let importDeclaration: ImportDeclaration | null = null;
  let isEnd = false;
  return {
    visitor: {
      Program: {
        exit() {
          isEnd = true;
        },
      },
      // ImportDeclaration(path: any) {
      //   console.log(path);
      // },
      // CallExpression(path: NodePath) {
      //   // collect require
      //   const node = path.node as CallExpression;
      //   const parent = path.parent;
      //   if(t.isIdentifier(node.callee) && node.callee.name === 'require' && t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) {
      //     requireVar.push(parent.id.name)
      //   }
      // },
      // TODO: do not transform import or require MemberExpression
      MemberExpression(path: NodePath, state: any) {
        const node = path.node as MemberExpression;
        const obj = node.object as Expression;
        if (replaceRoot === null && !isInGlobal(node)) {
          replaceRoot = path;
        }
        if (replaceRoot) {
          paths.unshift(node.property);
        }
        if (isNeedConvert(node) && !isEnd) {
          // if parent node is AssignmentExpression and it's left node equals node, means set
          const _isSet = isSet(replaceRoot);
          const methodString = _isSet ? 'safeSet' : 'safeGet';
          // add import if not
          if (importDeclaration === null) {
            const codeBlock = state.file.ast.program as t.Program;
            const source = buildLiteral('@razors/babel-plugin-safe-object', 'string');
            importDeclaration = t.importDeclaration([buildImportSpecifier(methodString)], source);
            insertImportDeclaration(codeBlock.body, importDeclaration);
          } else {
            // add safeGet or safeSet when exists at the same time
            const specifiers = importDeclaration.specifiers;
            const existingSpecifier = specifiers[0] as ImportSpecifier;
            if (specifiers.length === 1 && existingSpecifier.imported.name !== methodString) {
              specifiers.push(buildImportSpecifier(methodString));
            }
          }
          // replace
          const callee = t.identifier(methodString);
          const properties = t.arrayExpression(paths.map(item => {
            return t.isIdentifier(item) ? buildLiteral(item.name, 'string') : item;
          }));
          const _arguments: Array<any> = [obj, properties];
          if (_isSet) {
            const value = (replaceRoot.parent as AssignmentExpression).right;
            _arguments.push(value);
          }
          const callExpression = t.callExpression(callee, _arguments);
          // when get, only replace; while set needs to  replace Assignment
          if (_isSet) {
            replaceRoot.parentPath.replaceWith(callExpression);
          } else {
            replaceRoot.replaceWith(callExpression);
          }
          // clear
          paths = [];
          replaceRoot = null;
        }
      },
    },
  };
}

export * from './helper';
