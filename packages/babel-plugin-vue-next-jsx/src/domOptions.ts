import {
  parserOptions
} from '@vue/compiler-dom'
import {build} from './build';
import directiveTransforms, {directiveParse} from './directives'
import attributeTransforms from './attributes'

const isNativeTag = parserOptions.isNativeTag
const isBuiltInComponent = parserOptions.isBuiltInComponent
const runtimeModuleName = 'vue'

export default {
  isNativeTag,
  isBuiltInComponent,
  build,
  runtimeModuleName,
  directiveTransforms,
  attributeTransforms,
  directiveParse,
  onError: (err) => {console.log(err);}
}
