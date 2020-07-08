import { isHTMLTag, isSVGTag } from '@vue/shared'
import {build} from './build';

const isNativeTag = tag => isHTMLTag(tag) || isSVGTag(tag)
const isDirective = (attr: string): boolean => attr.startsWith('v-')

export default {
  isDirective,
  isNativeTag,
  build
}
