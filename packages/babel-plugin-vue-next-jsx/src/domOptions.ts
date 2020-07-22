import {
  parserOptions,
  NOOP
} from './util/constant'
import {build} from './build';
import directiveTransforms, {directiveParse} from './directives'
import attributeParse from './attributes'

const isNativeTag = parserOptions.isNativeTag
const isBuiltInComponent = parserOptions.isBuiltInComponent
const runtimeModuleName = 'vue'

export default {
  isNativeTag,
  isBuiltInComponent,
  build,
  runtimeModuleName,
  directiveTransforms,
  attributeParse,
  directiveParse,
  onError: NOOP
}
