<script lang="tsx">
import {defineComponent, renderSlot} from 'vue'

export type ButtonProps = {
  types?: string
}

export default defineComponent({
  props: {
    type: String
  },
  setup(props, {slots}) {
    return () => {
      return (
        <button type="button">{slots.default(props.type)}</button>
      )
    }
  }
});

</script>

<style scoped lang="less">
.icon {
  font-size: 18px;
  vertical-align: text-bottom;
}
</style>
