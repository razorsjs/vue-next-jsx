import { JsxNode } from '../jsxNode';

// Do nothing!
// This is a special attribute to identify node is child
export default (name: string, value: any, index: number, jsxNode: JsxNode) => {
  jsxNode.__children = true
}
