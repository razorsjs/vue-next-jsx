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
  // import renderSlot from './renderSlot';

  const renderSlot = (str) => <div>{str}</div>

  export default () => {
    console.log(renderSlot);
    return (
      <test-component>
        {
          () => <div>ad</div>
        }
      </test-component>
    )
  }
</script>

<style scoped>

</style>
