<script lang="jsx">
  import Icon from '../components/icon'
  import {ref} from 'vue'

  export default () => {
    const isShow = ref(false)
    const contentEditable = ref(false)

    const d = ref('a')

    const onClick = () => {
      console.log('click');
    }
    const test = {
      beforeMount(el, binding, vnode, prevVnode) {
        console.log(el, vnode);
      },
    }
    return (
      <Icon icon="search" v-show={isShow} onClick = {isShow}>{d}<div contentEditable={contentEditable}>ad</div></Icon>
    )
  }
</script>

<style scoped>

</style>
