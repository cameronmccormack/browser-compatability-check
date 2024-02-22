import fs from 'fs';
import sass from 'sass';
import less from 'less';
import { getAllCssFiles } from '../../src/globbers/css-globber';
import {
  FILE_EXTENSIONS,
  FileExtension,
} from '../../src/helpers/filetype-helper';
import { sassTildeCustomImporter } from '../../src/globbers/custom-importers';

afterEach(() => jest.restoreAllMocks());

const ALL_TEST_CSS_FILES = [
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
    path: 'tests/test-data/dummy-css-files/less-files/subdirectory-1/imported-file-1a.less',
    contents: '/* test LESS content */\n',
    type: 'less',
  },
  {
    path: 'tests/test-data/dummy-css-files/less-files/subdirectory-1/imported-file-1b.less',
    contents: '/* test LESS content */\n',
    type: 'less',
  },
  {
    path: 'tests/test-data/dummy-css-files/less-files/subdirectory-2/imported-file-2a.less',
    contents: '/* test LESS content */\n',
    type: 'less',
  },
  {
    path: 'tests/test-data/dummy-css-files/less-files/test-less.less',
    contents: '/* test LESS content */\n',
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

test('finds all CSS files in directory and children', async () => {
  const expectedFiles = ALL_TEST_CSS_FILES;
  expect(await getAllCssFiles('tests/test-data/dummy-css-files', [])).toEqual(
    expectedFiles,
  );
});

describe('calls expected transpilation and file reading methods for each type of file', () => {
  test('reads CSS file', async () => {
    const fileContents = '/* mock CSS 123 */';
    const directoryPath =
      'tests/test-data/dummy-css-files/css-files/css-files-subdirectory';
    const expectedFilepath = directoryPath + '/test.css';
    const readFileSpy = jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(fileContents);

    const cssFiles = await getAllCssFiles(directoryPath, []);

    expect(cssFiles).toEqual([
      {
        path: expectedFilepath,
        contents: fileContents,
        type: 'css',
      },
    ]);

    expect(readFileSpy).toHaveBeenCalledWith(expectedFilepath, 'utf-8');
  });

  test('reads and transpiles SCSS file', async () => {
    const fileContents = '/* mock SCSS 123 */';
    const directoryPath = 'tests/test-data/dummy-css-files/scss-files';
    const expectedFilepath = directoryPath + '/test-scss.scss';
    const sassCompileSpy = jest
      .spyOn(sass, 'compile')
      .mockReturnValue({ css: fileContents, loadedUrls: [] });

    const cssFiles = await getAllCssFiles(directoryPath, []);

    expect(cssFiles).toEqual([
      {
        path: expectedFilepath,
        contents: fileContents,
        type: 'scss',
      },
    ]);

    expect(sassCompileSpy).toHaveBeenCalledWith(expectedFilepath, {
      importers: [sassTildeCustomImporter],
    });
  });

  test('reads and transpiles SASS file', async () => {
    const fileContents = '/* mock SASS 123 */';
    const directoryPath = 'tests/test-data/dummy-css-files/sass-files';
    const expectedFilepath = directoryPath + '/test-sass.sass';
    const sassCompileSpy = jest
      .spyOn(sass, 'compile')
      .mockReturnValue({ css: fileContents, loadedUrls: [] });

    const cssFiles = await getAllCssFiles(directoryPath, []);

    expect(cssFiles).toEqual([
      {
        path: expectedFilepath,
        contents: fileContents,
        type: 'sass',
      },
    ]);

    expect(sassCompileSpy).toHaveBeenCalledWith(expectedFilepath, {
      importers: [sassTildeCustomImporter],
    });
  });

  test('reads and transpiles LESS files', async () => {
    const fileContents = '/* test LESS content */\n';
    const directoryPath = 'tests/test-data/dummy-css-files/less-files';

    const expectedFilepaths = [
      `${directoryPath}/test-less.less`,
      `${directoryPath}/subdirectory-1/imported-file-1a.less`,
      `${directoryPath}/subdirectory-1/imported-file-1b.less`,
      `${directoryPath}/subdirectory-2/imported-file-2a.less`,
    ];
    const expectedLessRootDirectories = [
      `${directoryPath}/subdirectory-1`,
      `${directoryPath}/subdirectory-2`,
      directoryPath,
    ];

    const readFileSpy = jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue(fileContents);
    const lessRenderSpy = jest
      .spyOn(less, 'render')
      .mockReturnValue(
        Promise.resolve({ css: fileContents, map: '', imports: [] }),
      );

    const cssFiles = await getAllCssFiles(directoryPath, []);

    expect(cssFiles).toEqual(
      ALL_TEST_CSS_FILES.filter((file) => file.type === 'less'),
    );
    expectedFilepaths.forEach((expectedFilepath) => {
      expect(readFileSpy).toHaveBeenCalledWith(expectedFilepath, 'utf-8');
    });
    expect(lessRenderSpy).toHaveBeenCalledWith(fileContents, {
      paths: expectedLessRootDirectories,
    });
    expect(lessRenderSpy).toHaveBeenCalledTimes(expectedFilepaths.length);
  });
});

test('returns empty array for location containing no css files', async () => {
  expect(await getAllCssFiles('tests/globbers', [])).toEqual([]);
});

test('throws error for filepath that does not exist', () => {
  expect(() =>
    getAllCssFiles('tests/not-a-real-filepath', []),
  ).rejects.toThrow();
});

test.each([...FILE_EXTENSIONS, 'all'])(
  'ignores %s files in directory and children',
  async (extension) => {
    const expectedFiles =
      extension === 'all'
        ? []
        : ALL_TEST_CSS_FILES.filter(({ type }) => type !== extension);

    const fileExtensionIgnores = (
      extension === 'all' ? FILE_EXTENSIONS : [extension]
    ) as FileExtension[];

    expect(
      await getAllCssFiles(
        'tests/test-data/dummy-css-files',
        fileExtensionIgnores,
      ),
    ).toEqual(expectedFiles);
  },
);

test('includes filepath on error if error thrown when getting file contents', async () => {
  const directoryPath = 'tests/test-data/dummy-css-files/sass-files';
  const errorMessage = 'oh no - it is broken';

  jest.spyOn(sass, 'compile').mockImplementationOnce(() => {
    throw new Error(errorMessage);
  });

  await expect(getAllCssFiles(directoryPath, [])).rejects.toThrow(
    `Error in file tests/test-data/dummy-css-files/sass-files/test-sass.sass:\n\n${errorMessage}`,
  );
});

test('falls back to rethrowing error without message if non-Error is thrown', async () => {
  const directoryPath = 'tests/test-data/dummy-css-files/sass-files';
  const nonErrorThrowable = 'this does not extend error';

  jest.spyOn(sass, 'compile').mockImplementationOnce(() => {
    throw { nonErrorThrowable };
  });

  await expect(getAllCssFiles(directoryPath, [])).rejects.toHaveProperty(
    'nonErrorThrowable',
    nonErrorThrowable,
  );
});
