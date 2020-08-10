<script lang="tsx">
import { defineComponent } from 'vue';

export const text  = defineComponent({
  props: {
    text: String
  },
  setup(props) {
    return () => {
      return (
        <div>{props.text}</div>
      )
    }
  }
})

export default {}

</script>

<style scoped>
.button {
  color: red
}
</style>
