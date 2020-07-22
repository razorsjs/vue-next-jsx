/**
 * test plugin options
 */

import { compare, transformWithPlugin, vueCompiled } from './util';
import { domOptions } from '../index'
import { DirectiveNode, JsxNode } from '../src/jsxNode';
import { NodeTypes } from '../src/util/constant';

// a simple v-on-click transformer
const onTransformer = (name: string, value: any, jsxNode: JsxNode) => {
  let _name = name.split('-')
  const directiveNode: DirectiveNode = {
    type: NodeTypes.DIRECTIVE,
    name: _name[1],
    exp: value,
    arg: _name[2]
  };
  jsxNode.directives.push(directiveNode);
}

describe('options', () => {
  test('attrTransform', () => {
    const jsxCode = '<div v-on-click={click}>hello world</div>'
    const vueCode = '<div @click="click">hello world</div>'
    expect(transformWithPlugin(jsxCode, {
      attributeParse: domOptions.attributeParse.set(/^v-/g, onTransformer)
    })).toBe(vueCompiled(vueCode))
  })
})
