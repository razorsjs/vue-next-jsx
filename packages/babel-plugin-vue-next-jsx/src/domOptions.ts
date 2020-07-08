import { JsxNode } from './jsxNode';
import { types as t} from '@babel/core';
import { isHTMLTag, isSVGTag } from '@vue/shared'
import { generateCreateVNode, generateBlock, buildChildren, buildData } from './util';

const isNativeTag = tag => isHTMLTag(tag) || isSVGTag(tag)
const isDirective = (attr: string): boolean => attr.startsWith('v-')

const build = (node: JsxNode): t.ExpressionStatement | t.CallExpression => {
  const {path, tag, children, patchFlags} = node
  const args: any = [tag]
  if(children.length !== 0) {
    // data
    args.push(buildData(node))
    args.push(buildChildren(node))
    if(patchFlags) {
      args.push(t.numericLiteral(patchFlags))
    }
  }
  // generate
  if(t.isJSXElement(path.parent)) {
    return generateCreateVNode(args)
  } else {
    return generateBlock(args)
  }
}

export default {
  isDirective,
  isNativeTag,
  build
}
