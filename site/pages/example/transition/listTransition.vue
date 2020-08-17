<!--<template>-->
<!--  <div id="list-demo">-->
<!--    <button @click="add">Add</button>-->
<!--    <button @click="remove">Remove</button>-->
<!--    <transition-group name="list" tag="p">-->
<!--    <span v-for="item in items" :key="item" class="list-item">-->
<!--      {{ item }}-->
<!--    </span>-->
<!--    </transition-group>-->
<!--  </div>-->
<!--</template>-->

<script lang="tsx">
import {ref, reactive, getCurrentInstance} from 'vue'
import {withId} from '@razors/babel-plugin-vue-next-jsx/dist/runtime';

export default {
  name: 'index',
  setup() {
    const items = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9])
    const nextNum = ref(10)
    const add = () => {
      items.splice(randomIndex(), 0, nextNum.value++)
    }

    const randomIndex = () => {
      return Math.floor(Math.random() * items.length)
    }

    const remove = () => {
      items.splice(randomIndex(), 1)
    }

    const renderDefault = withId(() => {
      return items.map(item => {
        return (
          <span key={item} class="list-item">
            { item }
          </span>
        )
      })
    })

    return withId(() => {
      return (
        <div id="list-demo">
          <button onClick={add}>Add</button>
          <button onClick={remove}>Remove</button>
          <transition-group name="list" tag="p">
            {
              {
                default: renderDefault
              }
            }
          </transition-group>
        </div>
      )
    })
  }
};
</script>

<style scoped lang="less">
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active,
.list-leave-active {
  transition: all 1s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
