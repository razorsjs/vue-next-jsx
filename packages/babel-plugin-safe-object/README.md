### babel-plugin-safe-object
babel-plugin-safe-object is a babel plugin that transform 'x.y.z' to a more safe way.

## install
```bash
yarn add @razors/babel-plugin-safe-object
```

## usage
modify your .babelrc
```javascript
"plugins": ["@razors/babel-plugin-safe-object"]
```

## exclude
```javascript

// following situations will not transform
// system function
console.log()
// this
this.x.y
// UpdateExpression
x.y.z++
`````

## tips
a.b.length will return 0.

a.b.c will return undefined if not exist.

a.b.c = m will new object util end.
