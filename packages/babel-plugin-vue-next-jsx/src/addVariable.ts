/**
 * Helper for adding variable to program
 */
import {types as t, NodePath} from '@babel/core';
import jsxNode, {compVariableCollection} from './jsxNode';

export const addVariable = (declarator: t.VariableDeclarator, id: string) => {
  // We must place resolveComponent in a function because global components is registered in appContext and only in component instance which we can find ti
  // TODO: If use component not mentioned and not in a function, throw error
  const { extraExpression: {componentVariables} } = jsxNode
  if(!compVariableCollection.has(id)) {
    if(componentVariables) {
      compVariableCollection.set(id, true)
      componentVariables.declarations.push(declarator)
    } else {
      jsxNode.extraExpression.componentVariables = t.variableDeclaration('const', [declarator])
      // inject in function start
      const {path} = jsxNode
      const functionParent: NodePath<t.Function> = path.getFunctionParent();
      if(functionParent) {
        compVariableCollection.set(id, true)
        const body = functionParent.node.body
        if(t.isArrowFunctionExpression(functionParent.node) && t.isExpression(body)) {
          functionParent.node.body = t.blockStatement([
            jsxNode.extraExpression.componentVariables,
            t.returnStatement(body)
          ])
        } else {
          (body as t.BlockStatement).body.unshift(jsxNode.extraExpression.componentVariables)
        }
        jsxNode.extraExpression.componentVariables.parent = body as t.BlockStatement
      } else {
        // error
      }
    }
  }
}
