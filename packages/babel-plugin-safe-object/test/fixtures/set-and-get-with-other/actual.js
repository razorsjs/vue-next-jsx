function SuperClass() {
  this.x = {}
}

const undef = new SuperClass().x.y
const undef1 = new Map().x.y

