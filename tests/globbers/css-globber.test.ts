import fs from 'fs';
import sass from 'sass';
import { getAllCssFiles } from '../../src/globbers/css-globber';

test('finds all CSS files in directory and children', () => {
  const expectedFiles = [
    {
      path: 'tests/test-data/dummy-css-files/css-files/css-files-subdirectory/test.css',
      contents: '/* test content */',
      type: 'css',
    },
    {
      path: 'tests/test-data/dummy-css-files/css-files/test.css',
      contents: '/* test content */',
      type: 'css',
    },
    {
      path: 'tests/test-data/dummy-css-files/less-files/test-less.less',
      contents: '',
      type: 'less',
    },
    {
      path: 'tests/test-data/dummy-css-files/sass-files/test-sass.sass',
      contents: '/* test SASS content */',
      type: 'sass',
    },
    {
      path: 'tests/test-data/dummy-css-files/scss-files/test-scss.scss',
      contents: '/* test SCSS content */',
      type: 'scss',
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

describe('calls expected transpilation and file reading methods for each type of file', () => {
  test('reads CSS file', () => {
    const fileContents = '/* mock CSS 123 */';
    const directoryPath =
      'tests/test-data/dummy-css-files/css-files/css-files-subdirectory';
    const expectedFilepath = directoryPath + '/test.css';
    const readFileSpy = jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(fileContents);

    const cssFiles = getAllCssFiles(directoryPath);

    expect(cssFiles).toEqual([
      {
        path: expectedFilepath,
        contents: fileContents,
        type: 'css',
      },
    ]);

    expect(readFileSpy).toHaveBeenCalledWith(expectedFilepath, 'utf-8');
  });

  test('reads and transpiles SCSS file', () => {
    const fileContents = '/* mock SCSS 123 */';
    const directoryPath = 'tests/test-data/dummy-css-files/scss-files';
    const expectedFilepath = directoryPath + '/test-scss.scss';
    const sassCompileSpy = jest
      .spyOn(sass, 'compile')
      .mockReturnValue({ css: fileContents, loadedUrls: [] });

    const cssFiles = getAllCssFiles(directoryPath);

    expect(cssFiles).toEqual([
      {
        path: expectedFilepath,
        contents: fileContents,
        type: 'scss',
      },
    ]);

    expect(sassCompileSpy).toHaveBeenCalledWith(expectedFilepath);
  });

  test('reads and transpiles SASS file', () => {
    const fileContents = '/* mock SASS 123 */';
    const directoryPath = 'tests/test-data/dummy-css-files/sass-files';
    const expectedFilepath = directoryPath + '/test-sass.sass';
    const sassCompileSpy = jest
      .spyOn(sass, 'compile')
      .mockReturnValue({ css: fileContents, loadedUrls: [] });

    const cssFiles = getAllCssFiles(directoryPath);

    expect(cssFiles).toEqual([
      {
        path: expectedFilepath,
        contents: fileContents,
        type: 'sass',
      },
    ]);

    expect(sassCompileSpy).toHaveBeenCalledWith(expectedFilepath);
  });

  test('reads and transpiles LESS file', () => {
    const directoryPath = 'tests/test-data/dummy-css-files/less-files';
    const expectedFilepath = directoryPath + '/test-less.less';

    const cssFiles = getAllCssFiles(directoryPath);

    expect(cssFiles).toEqual([
      {
        path: expectedFilepath,
        contents: '', // TODO: update this test once LESS transpilation is implemented
        type: 'less',
      },
    ]);
  });
});

test('returns empty array for location containing no css files', () => {
  expect(getAllCssFiles('tests/globbers')).toEqual([]);
});

test('throws error for filepath that does not exist', () => {
  expect(() => getAllCssFiles('tests/not-a-real-filepath')).toThrow();
});
