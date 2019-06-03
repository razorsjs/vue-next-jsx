export function safeGet(obj: object | Array<any>, property?: Array<string | number>) {
  // will return undefined when property not an array
  // will return undefined when obj is not object or array
  if (!property || property.length === 0) return undefined;
  return property.reduce((pre: any, value) => {
    return pre !== undefined ? pre[value] : undefined;
  }, obj);
}
