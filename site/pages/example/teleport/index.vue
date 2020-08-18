<!--<template>-->
<!--<button @click="modalOpen = true">-->
<!--  Open full screen modal! (With teleport!)-->
<!--</button>-->

<!--<teleport to="body">-->
<!--  <div v-if="modalOpen" class="modal">-->
<!--    <div>-->
<!--      I'm a teleported modal!-->
<!--      (My parent is "body")-->
<!--      <button @click="modalOpen = false">-->
<!--        Close-->
<!--      </button>-->
<!--    </div>-->
<!--  </div>-->
<!--</teleport>-->
<!--</template>-->

<script lang="tsx">
import {ref} from 'vue'
import { withId } from '@razors/babel-plugin-vue-next-jsx/dist/runtime';
export default {
  name: "index",
  setup() {
    const modalOpen = ref(false)

    const renderTeleport = withId(() => {
      return modalOpen.value ? <div class="modal">
        <div>
          I'm a teleported modal!
          (My parent is "body")
          <button onClick={()=>modalOpen.value = false}>
            Close
          </button>
        </div>
      </div> : null
    })

    // return {
    //   modalOpen
    // }

    return withId(() => {
      return (
        <div>
          <button onClick={()=>modalOpen.value = true}>
          Open full screen modal! (With teleport!)
          </button>

          <teleport to="body">
            {renderTeleport()}
          </teleport>
        </div>
      )
    })
  }
}
</script>

<style scoped>
.modal {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-color: rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 300px;
  height: 300px;
  padding: 5px;
}
</style>
