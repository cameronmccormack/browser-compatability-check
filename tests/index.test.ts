import { main } from '../src';

test('dummy test for wip main function', () => {
  expect(() =>
    main({ properties: [], selectors: [], functions: [], atRules: [] }),
  ).not.toThrow();
});
