<script lang="tsx">
/**
 * A component use global component and local component
 */
import {defineComponent} from 'vue'
import localButton from './localButton.vue'

const local = localButton;

export default defineComponent({
  setup() {
    return () => {
      return (
        [
          <a-button type="primary">
            {
              (type) => <div>{type}</div>
            }
          </a-button>,
          <localButton type="primary">
            {
              (type) => <div>{type}</div>
            }
          </localButton>
        ]
      )
    }
  }
})
</script>

<style scoped>

</style>
