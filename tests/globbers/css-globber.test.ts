import { getAllCssFiles } from '../../src/globbers/css-globber';

test('finds all CSS files in directory and children', () => {
  const expectedFiles = [
    {
      path: 'tests/test-data/dummy-css-files/test-directory-1/test-directory-2/test.css',
      contents: '/* test content */',
      type: 'css',
    },
    {
      path: 'tests/test-data/dummy-css-files/test-directory-1/test.css',
      contents: '/* test content */',
      type: 'css',
    },
    {
      path: 'tests/test-data/dummy-css-files/test1.css',
      contents: '/* test content 1 */',
      type: 'css',
    },
    {
      path: 'tests/test-data/dummy-css-files/test2.css',
      contents: '/* test content 2 */',
      type: 'css',
    },
  ];
  expect(getAllCssFiles('tests/test-data/dummy-css-files')).toEqual(
    expectedFiles,
  );
});

test('returns empty array for location containing no css files', () => {
  expect(getAllCssFiles('tests/globbers')).toEqual([]);
});

test('returns null for filepath that does not exist', () => {
  expect(getAllCssFiles('tests/not-a-real-filepath')).toBe(null);
});
