<script lang="tsx">
import {ref} from 'vue'

// inline functional component
const inlineFuncText = ({},{slots}) => {
  return (
    <div>functional:{slots.default()}</div>
  )
}

// inline component
const inlineText = {
  setup({},{slots}) {
    return () => {
      return (
        <div>inline:{slots.default()}</div>
      )
    }
  }
}

export default {
  components: {
    inlineText,
    inlineFuncText
  },
  setup() {
    const text = ref('inlineText')
    const on = () => {
      text.value = 'inlineFuncText'
    }
    return () => {
      return (
        <component is={text.value} onClick={on}>
          123
        </component>
      )
    }
  }
}
</script>

<style scoped>

</style>
