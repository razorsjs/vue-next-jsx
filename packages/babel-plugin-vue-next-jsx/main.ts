import jsx from "@babel/plugin-syntax-jsx";
import { transformJSXElement } from './src/transformJSXElement';
import {NodePath, types as t} from '@babel/core'
import { jsxNodeInit, PluginOptions } from './src/jsxNode';

export default ({}, options: PluginOptions) => {
  return {
    name: 'babel-plugin-vue-next-jsx',
    inherits: jsx,
    visitor: {
      JSXElement: {
        exit(path: NodePath<t.JSXElement>, state) {
          jsxNodeInit(path, options)
          path.replaceWith(transformJSXElement())
        },
      }
    },
  }
}
