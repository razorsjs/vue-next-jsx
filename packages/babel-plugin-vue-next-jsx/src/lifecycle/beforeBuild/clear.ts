import { JsxNode } from '../../jsxNode';

/**
 * clear unused component
 * e.g.: <component :is='a'/>
 * _component_ will be added default, so we delete _component_ in directives, and we must clear empty declarations there.
 * @param node
 */
export const clearComponentVariables = (node: JsxNode) => {
  const {extraExpression: {componentVariables}} = node
  if(componentVariables) {
    if(componentVariables?.declarations?.length === 0 && componentVariables.parent) {
      const functionalBlock = componentVariables.parent;
      functionalBlock.body.shift()
    }
  }
}
