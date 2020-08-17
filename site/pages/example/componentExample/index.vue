<script lang="tsx">
/**
 * A component use global component and local component
 */
import {defineComponent, ref} from 'vue'
import localButton from './localButton.vue'

export default defineComponent({
  components: {
    localButton
  },
  setup() {
    const localButtonRef = ref(null)
    const on = () => {
      console.log(localButtonRef.value);
    }
    return () => {
      return (
        [
          <a-button type="primary">
            {
              (type) => <div>{type}</div>
            }
          </a-button>,
          <localButton type="primary" ref={localButtonRef} onClick={on}>
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

<style lang="less" scoped>
button {
  color: red
}
</style>
