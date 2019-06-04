export function safeGet(obj: object | Array<any>, properties?: Array<string | number>) {
  // will return undefined when property not an array
  // will return undefined when obj is not object or array
  if (!properties || properties.length === 0) return undefined;
  return properties.reduce((pre: any, value) => {
    return pre !== undefined ? pre[value] : undefined;
  }, obj);
}
