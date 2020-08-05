<template>
  <Icon icon="search" v-show="isShow">123<div :contentEditable="contentEditable">{{isShow}}</div></Icon>
</template>

<script lang="tsx">
  import Icon from '../components/icon'
  import {ref} from 'vue'

  export default {
    components: {
      Icon
    },
    setup() {
      const isShow = ref(true)
      const contentEditable = ref(false)

      const onClick = () => {
        console.log('click');
      }
      const test = {
        beforeMount(el, binding, vnode, prevVnode) {
          console.log(el, vnode);
        },
      }
      return {
        isShow,
        contentEditable
      }
    }
  }
</script>

<style scoped>

</style>
