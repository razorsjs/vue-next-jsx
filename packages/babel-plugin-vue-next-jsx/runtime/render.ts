import {createCommentVNode} from 'vue'
/**
 * Render an comment as emptyBlock
 */
export const renderEmptyBlock = () => {
  return createCommentVNode('v-if', true)
}
