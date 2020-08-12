import jsx from "@babel/plugin-syntax-jsx";
import { transformJSXElement } from './src/transformJSXElement';
import { NodePath, types as t, Node, PluginPass } from '@babel/core';
import { jsxNodeInit, PluginOptions, compCollection } from './src/jsxNode';

import domOptions from './src/domOptions'
import jsxNode, {removeCollection} from './src/jsxNode';
import { VariableDeclarator } from '@babel/types';

export {
  domOptions,
  jsxNode
}

/**
 * transformer
 * @param options
 */
export default ({}, options: PluginOptions) => {
  return {
    name: 'babel-plugin-vue-next-jsx',
    inherits: jsx,
    visitor: {
      ImportSpecifier: {
        enter(path: NodePath<t.ImportSpecifier>, state:PluginPass) {
          compCollection.push(path.node.local.name)
        }
      },
      ImportDefaultSpecifier: {
        enter(path: NodePath<t.ImportDefaultSpecifier>, state:PluginPass) {
          compCollection.push(path.node.local.name)
        }
      },
      VariableDeclaration: {
        enter(path: NodePath<t.VariableDeclaration>, state:PluginPass) {
          path.node.declarations.forEach(declarator => {
            if(t.isVariableDeclarator(declarator)) {
              if(t.isIdentifier(declarator.id)) {
                compCollection.push(declarator.id.name)
              }
            }
          })
        }
      },
      JSXFragment: {
        exit(path: NodePath<Node>, state:PluginPass) {
          // Just do replacing in root
          jsxNodeInit(path, options, state.file.path as NodePath<t.Program>)
          path.replaceWith(transformJSXElement())
        },
      },
      JSXElement: {
        exit(path: NodePath<Node>, state: PluginPass) {
          jsxNodeInit(path, options, state.file.path as NodePath<t.Program>)
          path.replaceWith(transformJSXElement())
        },
      },
      Program: {
        exit() {
          removeCollection()
        }
      }
    },
  }
}
