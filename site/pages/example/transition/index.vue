<script lang="tsx">
import {ref} from 'vue'
import {withId} from '@razors/babel-plugin-vue-next-jsx/dist/runtime';

export default {
  name: 'index',
  setup() {
    const show = ref(false)
    const onClick = () => {
      show.value = !show.value
    }
    return withId(() => {
      return (
        <div>
          <div id="demo">
            <button onClick={onClick}>
            Toggle
          </button>

          <transition name="fade">
            <p v-show={show.value}>hello</p>
          </transition>
        </div>
        </div>
      )
    })
  }
};
</script>

<style scoped lang="less">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
