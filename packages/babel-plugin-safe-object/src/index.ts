import { types as t, NodePath, template } from '@babel/core';
import { MemberExpression, Identifier, Expression } from '@babel/types';
import { buildImportSpecifier, buildLiteral, insertImportDeclaration } from './babel-util';

export default function() {
  let paths: string[] = [];
  let replacePath: any = null;
  let importDeclaration: any = null;
  return {
    visitor: {
      Program(path: NodePath) {
        console.log(1);
      },
      MemberExpression(path: NodePath) {
        const node = path.node as MemberExpression;
        paths.unshift(node.property.name);
        const obj = node.object as Expression;
        if (replacePath === null) {
          replacePath = path;
        }
        // TODO: do not transform import or require MemberExpression
        if (t.isIdentifier(obj) && !t.isSequenceExpression(path.parent)) {
          if (importDeclaration === null) {
            const codeBlock = path.scope.block as t.Program;
            // add import
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
