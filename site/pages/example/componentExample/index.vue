<template>
  <button>s</button>
</template>
<script lang="tsx">
/**
 * A component use global component and local component
 */
import {defineComponent} from 'vue'
import localButton from './localButton.vue'

// export default defineComponent({
//   components: {
//     localButton
//   },
//   setup() {
//     return () => {
//       return (
//         [
//           <a-button type="primary">
//             {
//               (type) => <div>{type}</div>
//             }
//           </a-button>,
//           <localButton type="primary">
//             {
//               (type) => <div>{type}</div>
//             }
//           </localButton>
//         ]
//       )
//     }
//   }
// })
export default {}
</script>

<style lang="less" scoped>
button {
  color: red
}
</style>
