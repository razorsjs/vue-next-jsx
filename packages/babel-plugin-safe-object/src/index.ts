import { types as t, NodePath } from '@babel/core';
import { MemberExpression, Identifier, Expression } from '@babel/types';

export default function(babel: any) {
  let paths: string[] = [];
  return {
    visitor: {
      MemberExpression(path: NodePath) {
        const node = path.node as MemberExpression;
        paths.unshift(node.property.name);
        const obj = node.object as Expression;
        if(obj.type === 'Identifier') {
          console.log(path);
        }
      },
    },
  };
}
