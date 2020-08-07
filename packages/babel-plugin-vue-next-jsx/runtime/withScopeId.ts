import {getCurrentInstance, withScopeId} from '@vue/runtime-core'

export const withId = (fn: Function) => {
  const instance = getCurrentInstance();
  if(instance) {
    const id = (instance.type as any).__scopeId
    if(id) {
      return withScopeId(id)(fn)
    } else {
      throw new Error(`can't get current scopeId, please make sure you have added scoped attr!`)
    }
  } else {
    throw new Error(`can't get current instance!`)
  }
}
