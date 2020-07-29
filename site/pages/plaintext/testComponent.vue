<template>
  <div>
    <slot></slot>
  </div>
</template>
<script lang="jsx">
  export default {
    setup(props, context) {
      console.log(context);
      return {

      }
    }
  }
  // export default (props, context) => {
  //   console.log(context);
  //   return (
  //     <div>{[context.slots.default('asdd')]}</div>
  //   )
  // }
</script>

<style scoped>

</style>
