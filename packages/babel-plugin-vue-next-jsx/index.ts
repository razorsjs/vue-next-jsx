import jsx from "@babel/plugin-syntax-jsx";
import { transformJSXElement } from './src/transformJSXElement';
import { NodePath, types as t, Node, PluginPass } from '@babel/core';
import { jsxNodeInit, PluginOptions } from './src/jsxNode';

import domOptions from './src/domOptions'
export {
  domOptions
}

export default ({}, options: PluginOptions) => {
  return {
    name: 'babel-plugin-vue-next-jsx',
    inherits: jsx,
    visitor: {
      JSXFragment: {
        exit(path: NodePath<Node>, state:PluginPass) {
          // Just do replacing in root
          jsxNodeInit(path, options, state.file.path)
          path.replaceWith(transformJSXElement())
        },
      },
      JSXElement: {
        exit(path: NodePath<Node>, state: PluginPass) {
          jsxNodeInit(path, options, state.file.path)
          path.replaceWith(transformJSXElement())
        },
      }
    },
  }
}
