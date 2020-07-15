/**
 * manage and generate fragments: import {} from 'vue'
 */
import {helperNameMap} from './util/constant'
import {importTransform} from './gen/generateCode';
import { addNamed } from "@babel/helper-module-imports";

// all vue import
export const vueImportMap = []

export function addVueImport(name: any): string {
  // add import at top
  return importTransform(helperNameMap[name])
}
