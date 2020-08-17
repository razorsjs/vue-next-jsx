<script lang="tsx">
import {defineComponent} from 'vue'
import { withId } from '@razors/babel-plugin-vue-next-jsx/dist/runtime'

export default defineComponent({
  render() {
    return withId((() => (
      <div>
        <router-view>
          {
            ({Component}) => <keep-alive><component is={Component} /></keep-alive>
          }
        </router-view>
      </div>
    )))()
  }
})
</script>

<style scoped lang="less">
div {
  font-size: 20px
}
</style>
