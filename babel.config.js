module.exports = api => {
  if(api.env('test')) {
    return {}
  }
  return {
    "presets": [
      ["@babel/preset-env"],
    ],
    "plugins": [
      ["@razors/babel-plugin-vue-next-jsx"]
    ]
  }
}
