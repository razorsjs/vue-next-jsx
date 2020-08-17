<script lang="tsx">
import {withId} from '@razors/babel-plugin-vue-next-jsx/dist/runtime';
import {ref, useCssVars} from 'vue'

/**
 * cssVars with scope css
 */
export default {
  setup() {
    const color = ref('blue')

    useCssVars(() => ({
      color: color.value
    }))

    const onClick = () => {
      color.value === 'red' ? color.value = 'blue': color.value = 'red'
    }

    return withId(()=>{
      return (
        <button type="button" onClick={onClick}>
          cssVars
        </button>
      )
    })
  }
}
</script>

<style scoped>
button {
  color: var(--color);
}
</style>
