# Vue-next-jsx
A babel plugin that provides jsx syntax for vue-next

# Feature

* Consistent with @vue/compiler-core, @vue/compiler-dom，@vue/shared, including compiled results, test cases and library.

* Fully vue directives and components supported.

* Same plugin options with @vue/compiler-core, look at.

* The ability to customize your own directives and props, both parse(syntax) and transform.

# Use

## Install

install in npm

```javascript
npm install @razors/babel-plugin-vue-next-jsx
```
or in yarn

```javascript
yarn add @razors/babel-plugin-vue-next-jsx
```

Then change your babel config
```javascript
{
    "presets": [
      ["@babel/preset-env"],
    ],
    "plugins": [
      ["@razors/babel-plugin-vue-next-jsx"]
    ]
}
```

## base syntax

In functional component(recommend)

```typescript jsx
export default () => <div/>
```

In render function

```typescript jsx
export default {
  render() {
    return <div/>
  }
}
```

In setup function

```typescript jsx
export default {
  setup() {
    return () => <div/>
  }
}
```

## component

Functional component:

```typescript jsx
export default () => <material-button/>
```

Normal component:

```typescript jsx
export default {
  render() {
    return <material-button/>
  }
}
```

Tips: If you already imported component or declare function component, no need to write component options.

## directive

* All v-xx and vXx attributes will be parsed as directives. For example, v-on and vOn is same.

* All directives value will be parsed in this format: [arg, exp, modifiers]

### props(v-bind)

### event handler(v-on)

### other

support v-html, v-is, v-model, v-show, v-text like vue

## slot



## fragment

## under developing

- [x] v-once
- [x] cacheHandlers
- [x] optimizeImports
- [x] hoistStatic
- [x] SSR support

