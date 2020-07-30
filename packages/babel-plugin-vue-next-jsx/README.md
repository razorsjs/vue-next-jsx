# Vue-next-jsx
A babel plugin that provides jsx syntax for vue-next

# Feature

*Consistent with @vue/compiler-core, @vue/compiler-dom，@vue/shared, including compiled results, test cases and library.

*Fully vue directives and components supported.

*Same plugin options with @vue/compiler-core, look at.

*The ability to customize your own directives and props, both parse(syntax) and transform.

# Use

## Install

## base syntax

## directive

*All v-xx and vXx attributes will be parsed as directives. For example, v-on and vOn is same.

*All directives value will be parsed in this format: [arg, exp, modifiers]

### event handler(v-on)

### props(v-bind)

### other

support v-html, v-is, v-model, v-show, v-text like vue

## slot

## fragment
