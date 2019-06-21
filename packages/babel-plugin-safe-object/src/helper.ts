export function safeGet(obj: object | Array<any>, properties?: Array<string | number>) {
  // will return undefined when obj is not object or array
  // will return 0 if last property is length
  const undefined = void 0;
  if (!properties || properties.length === 0) return undefined;
  return properties.reduce((pre: any, value, index: number) => {
    return pre !== undefined ? pre[value] : ((value === 'length' && index === properties.length - 1) ? 0 : undefined);
  }, obj);
}

export function safeSet(obj: object | Array<any>, properties: Array<string | number>, val?: any) {
  const undefined = void 0;
  if (properties.length === 0 || val === undefined) return;
  return properties.reduce((pre: any, value, index: number) => {
    if (pre[value] === undefined) {
      pre[value] = {};
    }
    if (index === properties.length - 1) {
      pre[value] = val;
    }
    return pre[value];
  }, obj);
}
