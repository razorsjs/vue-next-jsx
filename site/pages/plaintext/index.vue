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
    const maps = [1,2]
    return (
      <div color="a">
        <>
          a
          <div>dasd</div>
        </>
      </div>
    )
  }
</script>

<style scoped>

</style>
