<!--<template>-->
<!--  <div>-->
<!--    <slot></slot>-->
<!--  </div>-->
<!--</template>-->
<script lang="jsx">
  export default (props, {slots}) => {
    return <div>{slots.test(123)}</div>
  }
</script>

<style scoped>

</style>
