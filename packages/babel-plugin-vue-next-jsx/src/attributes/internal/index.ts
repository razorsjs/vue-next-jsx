import { JsxNode } from '../../jsxNode';

/**
 * some special attr to force jsx rendered as block or vnode
 */

export const __vnode = (name: string, value: any, index: number, jsxNode: JsxNode) => {
  jsxNode.mode = 'vnode'
}

export const __block = (name: string, value: any, index: number, jsxNode: JsxNode) => {
  jsxNode.mode = 'block'
}
