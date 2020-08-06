<script lang="tsx">

/**
 * A counter example
 */

import {defineComponent,ref} from 'vue'

export default defineComponent({
  setup() {
    const count = ref(0)
    const add = () => count.value++

    return () => (
      [
        <div>
          {count.value}
        </div>,
        <button onClick={add}>
          add
        </button>,
      ]
    )
  }
})
</script>

<style scoped>

</style>
