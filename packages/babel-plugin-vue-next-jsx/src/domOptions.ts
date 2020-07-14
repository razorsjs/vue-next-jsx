import {
  parserOptions
} from '@vue/compiler-dom'
import {build} from './build';

const isNativeTag = parserOptions.isNativeTag
const isDirective = (attr: string): boolean => attr.startsWith('v-')
const isBuiltInComponent = parserOptions.isBuiltInComponent

export default {
  isDirective,
  isNativeTag,
  isBuiltInComponent,
  build
}
