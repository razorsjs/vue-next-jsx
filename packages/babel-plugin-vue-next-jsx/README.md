# Vue-next-jsx
A babel plugin that provides jsx syntax for vue-next

# Feature

* Consistent with @vue/compiler-core, @vue/compiler-dom，@vue/shared, including compiled results, test cases and library.

* Fully vue directives and components supported.

* Same plugin options with @vue/compiler-core, look at.

* The ability to customize your own directives and props, both parse(syntax) and transform.

# Usage

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

Functional component

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
    return () => {
      return (
        <div>hello world</div>
      )
    }
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

### props(v-bind)

### event handler(v-on)

## directive

* All v-xx and vXx attributes will be parsed as directives. For example, v-on and vOn is same.

* All directives value will be parsed in this format: [arg, exp, modifiers]

support directive: v-html, v-is, v-model, v-show, v-text, v-bind, v-on

## fragment

Use <></>

```typescript jsx
<>
  <div>1<div>
  <div>2<div>
</>
```

## slot

### default slot

```typescript jsx
<test>test</test>
```

### Named and scoped slot:

```typescript jsx
<test>
{
  (str) => <div>{str}</div>
}
</test>
```

or use literal object

```typescript jsx
<test>
{
  {
    default: (str) => <div>{str}</div>
  }
}
</test>
```

### use

```typescript jsx
  setup(props, {slots}) {
    return () => {
      return (
        <div>{slots.default()}</div>
      )
    }
  }
```

Tips: use vue's renderSlot when your default slot have multiple root, or use <></> literal

example:

when you write:

```typescript jsx
<test>
  <div>1</div>
  <div>2</div>
</test>
```

usage:

```typescript jsx
<div>{renderSlot(slots, 'default')}</div>
```

or

write:

```typescript jsx
<test>
  <>
    <div>1</div>
    <div>2</div>
  </>
</test>
```

usage:

```typescript jsx
<div>{slots.default()}</div>
```

## scoped css

By default, we don't change setup or render function.So you must wrap your render or setup function by withId provided by runtime.

```typescript jsx
import { withId } from '@razors/babel-plugin-vue-next-jsx/dist/runtime'
export default {
  setup() {
    return withId(()=><div/>)
  }
}
```

## under developing

- [x] inline component
- [x] v-once
- [x] cacheHandlers
- [x] optimizeImports
- [x] hoistStatic
- [x] SSR support

