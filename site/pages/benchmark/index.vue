<template>
  <button @click="shuffle">click</button>
  <div v-for="item in data">
    {{item}}
  </div>
</template>

<script lang="js">
import {reactive} from 'vue'
let arr = [];
for(let i=0;i<100000;i++) {
  arr.push(i)
}

export default {
  name: "index",
  setup() {
    const data = reactive(arr)

    /**
     * Shuffles array in place. ES6 version
     * @param {Array} a items An array containing the items.
     */
    function _shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    const shuffle = () => _shuffle(data)

    return {
      data,
      shuffle
    }
  }
}
</script>
