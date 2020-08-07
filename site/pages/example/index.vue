<script lang="tsx">

/**
 * A counter example
 */

import {defineComponent,ref} from 'vue'
import { withId } from '@razors/babel-plugin-vue-next-jsx/dist/runtime'

export default defineComponent({
  setup() {
    const count = ref(0)
    const add = () => count.value++

    return withId(() => {
      return [
        <div>
          {count.value}
        </div>,
        <button onClick={add}>
          add
        </button>
      ]
    })
  }
})
</script>

<style lang="less" scoped>
button {
  color: red
}
</style>

