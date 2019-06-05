import { types as t, NodePath, template } from '@babel/core';
import { MemberExpression, Expression, CallExpression } from '@babel/types';
import { buildImportSpecifier, buildLiteral, insertImportDeclaration } from './babel-util';

export default function() {
  let paths: Array<string> = [];
  let replacePath: any = null;
  let importDeclaration: any = null;
  let isEnd = false;
  return {
    Program: {
      exit() {
        isEnd = true;
      },
    },
    visitor: {
      // ImportDeclaration(path:any) {
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
      MemberExpression(path: NodePath, state: any) {
        const node = path.node as MemberExpression;
        paths.unshift(node.property.name);
        const obj = node.object as Expression;
        if (replacePath === null) {
          replacePath = path;
        }
        // TODO: do not transform import or require MemberExpression
        if (t.isIdentifier(obj) && !isEnd) {
          // add import if not
          if (importDeclaration === null) {
            const codeBlock = path.scope.block as t.Program;
            const source = buildLiteral('../../../dist', 'string');
            importDeclaration = t.importDeclaration([buildImportSpecifier('safeGet')], source);
            // const importCode = `import {safeGet} from '../../../src';`;
            // const importDeclaration = template.ast(importCode, {
            //   sourceType: 'module',
            // }) as t.ImportDeclaration;
            insertImportDeclaration(codeBlock.body, importDeclaration);
          }

          // replace
          const callee = t.identifier('safeGet');
          const originObj = t.identifier(`${obj.name}`);
          const properties = t.arrayExpression(paths.map(item => {
            return buildLiteral(item, 'string');
          }));
          const callExpression = t.callExpression(callee, [originObj, properties]);
          replacePath.replaceWith(callExpression);

          // clear
          paths = [];
          replacePath = null;
        }
      },
    },
  };
}

export * from './helper';
