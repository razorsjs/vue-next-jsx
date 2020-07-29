<!--<template>-->
<!--  <test-component>-->
<!--    <div>123</div>-->
<!--  </test-component>-->
<!--</template>-->

<script lang="jsx">
  import TestComponent from './testComponent'
  // export default {
  //   components: {
  //     TestComponent
  //   }
  // }
  import {ref} from 'vue'

  export default () => {
    return (
      <test-component>
        {
          (str) => [<div>2133</div>, <div>123</div>]
        }
      </test-component>
    )
  }
</script>

<style scoped>

</style>
