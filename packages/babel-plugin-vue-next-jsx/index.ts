import jsx from "@babel/plugin-syntax-jsx";
import { transformJSXElement } from './src/transformJSXElement';
import {NodePath, types as t, Node} from '@babel/core'
import { jsxNodeInit, PluginOptions } from './src/jsxNode';
import { isLeaf } from './src/util';

export default ({}, options: PluginOptions) => {
  return {
    name: 'babel-plugin-vue-next-jsx',
    inherits: jsx,
    visitor: {
      JSXFragment: {
        exit(path: NodePath<Node>, state) {
          // Just do replacing in root
          // TODO: If path is leaf, replace it by its children
          jsxNodeInit(path, options)
          path.replaceWith(transformJSXElement())
        },
      },
      JSXElement: {
        exit(path: NodePath<Node>, state) {
          jsxNodeInit(path, options)
          path.replaceWith(transformJSXElement())
        },
      }
    },
  }
}
