<!--<template>-->
<!--  <test-component>-->
<!--    <div>123</div>-->
<!--  </test-component>-->
<!--</template>-->

<script lang="jsx">
  import testComponent from './testComponent';
  export default () => {
    const slot = {
      test: (str) => {
        return <span>{str}</span>
      }
    }
    return (
      <testComponent>
        {
          {
            test: (str) => {
              return <span>{str}</span>
            }
          }
        }
      </testComponent>
    )
  }
</script>

<style scoped>

</style>
