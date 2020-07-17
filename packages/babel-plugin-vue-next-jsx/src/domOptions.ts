import {
  parserOptions
} from '@vue/compiler-dom'
import {build} from './build';
import directiveTransforms from './directives'

const isNativeTag = parserOptions.isNativeTag
const isBuiltInComponent = parserOptions.isBuiltInComponent
const runtimeModuleName = 'vue'
const isDirective = (attr: string): boolean => attr.startsWith('v-')

export default {
  isDirective,
  isNativeTag,
  isBuiltInComponent,
  build,
  runtimeModuleName,
  directiveTransforms
}
