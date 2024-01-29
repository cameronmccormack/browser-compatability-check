import { isValidFilepath } from '../../src/helpers/filepath-helper';

type TestData = {
  path: string;
  expectedResult: boolean;
};

const testCases: [string, TestData][] = [
  [
    'file that exists',
    { path: 'tests/test-data/dummy-css-files/test1.css', expectedResult: true },
  ],
  [
    'file that does not exist',
    { path: 'tests/test-data/dummy-css-files/bad.css', expectedResult: false },
  ],
  [
    'directory that exists',
    { path: 'tests/test-data/dummy-css-files', expectedResult: true },
  ],
  [
    'directory that does not exist',
    { path: 'tests/test-data/not-real', expectedResult: false },
  ],
];

test.each<[string, TestData]>(testCases)(
  'isValidFilepath returns expected result for case: %s',
  (_, { path, expectedResult }) => {
    expect(isValidFilepath(path)).toEqual(expectedResult);
  },
);
