import path from 'path';

function f() {
  const obj = {};
  const undef = obj.a.b;

  const obj1 = {};
  const undef1 = obj1.x.y;
}
