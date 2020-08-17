export default {
  mounted(el, binding) {
    console.log('mounted');
    console.log(`mounted instance uid: ${binding.instance.$.uid}`);
  },
}
