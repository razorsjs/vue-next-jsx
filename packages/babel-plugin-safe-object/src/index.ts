import { types as t, NodePath, template } from '@babel/core';
import { MemberExpression, Expression, AssignmentExpression, CallExpression, NumberLiteral } from '@babel/types';
import { buildImportSpecifier, buildLiteral, insertImportDeclaration } from './babel-util';

function isSet(path: NodePath) {
  return t.isAssignmentExpression(path.parent) && path.parent.left === path.node
}
export default function() {
  let paths: Array<string> = [];
  let replaceRoot: any = null;
  let importDeclaration: any = null;
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
      // TODO: do not transform global MemberExpression
      MemberExpression(path: NodePath, state: any) {
        const node = path.node as MemberExpression;
        paths.unshift(node.property.name);
        const obj = node.object as Expression;
        if (replaceRoot === null) {
          replaceRoot = path;
        }
        if (t.isIdentifier(obj) && !isEnd) {
          // if parent node is AssignmentExpression and it's left node equals node, means set
          const _isSet = isSet(replaceRoot);
          const methodString =  _isSet ? 'safeSet' : 'safeGet';
          // add import if not
          if (importDeclaration === null) {
            const codeBlock = state.file.ast.program as t.Program;
            // TODO: production and test
            const source = buildLiteral('../../../dist', 'string');
            importDeclaration = t.importDeclaration([buildImportSpecifier(methodString)], source);
            insertImportDeclaration(codeBlock.body, importDeclaration);
          } else {
            // add safeGet or safeSet when exists at the same time
          }

          // replace
          const callee = t.identifier(methodString);
          const originObj = t.identifier(`${obj.name}`);
          const properties = t.arrayExpression(paths.map(item => {
            return buildLiteral(item, 'string');
          }));
          const _arguments: Array<any> = [originObj, properties];
          if (_isSet) {
            const value = (replaceRoot.parent as AssignmentExpression).right;
            _arguments.push(value)
          }
          const callExpression = t.callExpression(callee, _arguments);
          // when get, only replace; while set needs to  replace Assignment
          if(_isSet) {
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
