export function safeGet(obj: object | Array<any>, properties?: Array<string | number>) {
  // will return undefined when property not an array
  // will return undefined when obj is not object or array
  // will return 0 if last property is length
  if (!properties || properties.length === 0) return undefined;
  return properties.reduce((pre: any, value, index: number) => {
    return pre !== undefined ? pre[value] : ((value === 'length' && index === properties.length - 1) ? 0 : undefined);
  }, obj);
}
