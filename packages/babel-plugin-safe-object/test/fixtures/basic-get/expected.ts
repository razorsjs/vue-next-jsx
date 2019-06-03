import { safeGet } from '../../../src/helper';

export default {
  f: function() {
    const obj: any = {};
    const undef = safeGet(obj, ['a', 'b']);
  },
};
