<script lang="tsx">
// import namespace component
import * as t from './text.vue'

// inline functional component
const inlineFuncText = ({},{slots}) => {
  return (
    <div>{slots.default()}</div>
  )
}

// inline component
const inlineText = {
  setup({},{slots}) {
    return () => {
      return (
        <div>{slots.default()}</div>
      )
    }
  }
}

export default () => {
  return (
    <button type="button">
      <inline-func-text>test1</inline-func-text>
      <inline-text>test2</inline-text>
      <t.text text="test3"></t.text>
    </button>
  )
}
</script>

<style scoped>

</style>
