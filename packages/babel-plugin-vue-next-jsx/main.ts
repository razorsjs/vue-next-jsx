import jsx from "@babel/plugin-syntax-jsx";
import { transformJSXElement } from './src/transformJSXElement';
import {NodePath, types as t} from '@babel/core'

export default () => {
  return {
    name: 'babel-plugin-vue-next-jsx',
    inherits: jsx,
    visitor: {
      JSXElement: {
        exit(path: NodePath<t.JSXElement>, state) {
          path.replaceWith(transformJSXElement(path))
        },
      }
    },
  }
}
