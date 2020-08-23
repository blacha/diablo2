import o from 'ospec';
import { s } from '../index';
import { StrutTypeLookup } from '../lookup';

o.spec('StrutLookup', () => {
  enum Foo {
    bar = 1,
    baz = 2,
  }

  o('should lookup from enum', () => {
    const lookup = new StrutTypeLookup('Foo', s.i8, Foo);
    const val = lookup.parse([1], { offset: 0, startOffset: 0 });
    o(val.name).equals('bar');
    o(val.value).equals(1);
  });
});
