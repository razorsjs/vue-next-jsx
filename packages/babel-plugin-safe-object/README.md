### babel-plugin-safe-object

## install

## exclude

```javascript

// following situations will not transform

// system function
console.log()
// this
this.x.y
// UpdateExpression
x.y.z++
```
