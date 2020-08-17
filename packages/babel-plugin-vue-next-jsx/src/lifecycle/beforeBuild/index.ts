import { JsxNode } from '../../jsxNode';
import {clearComponentVariables} from './clear';

export const beforeBuild = (node: JsxNode) => {
  clearComponentVariables(node)
}
