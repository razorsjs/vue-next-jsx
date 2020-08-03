# babel-plugin-vue-next-unwrap-ref

Auto unwrap vue-next's ref variables to ref.value in both SFC and JSX!

Example:

```typescript jsx
import {ref} from 'vue'
export default () {
  const isShow = ref(false)
  return (
    <div v-show={isShow}></div>
  )
}
```

You don't need to write isShow.value anymore!

## Install

install in npm

```javascript
npm install @razors/babel-plugin-vue-next-unwrap-ref
```
or in yarn

```javascript
yarn add @razors/babel-plugin-vue-next-unwrap-ref
```

change your babel config
```javascript
{
    "presets": [
      ["@babel/preset-env"],
    ],
    "plugins": [
      ["@razors/babel-plugin-vue-next-unwrap-ref"]
    ]
}
```

## Tips

* Ref values which are not in current .vue file will not be transformed.

