import {types as t} from '@babel/core';
import {attrObject} from './genAttributes'
import {PatchFlags} from './constant'

/**
 * judge if has DynamicClass
 * @param attributes
 */
const hasClassBinding = (attributes) => {
  const _class = attributes.class;
  return _class && !t.isStringLiteral(_class)
}

const addFlags = (num: number, result:attrObject) => {
  result.patchFlags|=0;
  result.patchFlags+=num
}

export const extractPatchFlagFromAttrs = (attributes, result: attrObject) => {
  if(hasClassBinding(attributes)) {
    addFlags(PatchFlags.CLASS, result)
  }
}
