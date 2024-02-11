import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'sass';
import less from 'less';
import { CssPath, CssFile } from '../types/css-file';
import { FILE_EXTENSIONS, FileExtension } from '../helpers/filetype-helper';

const getAllCssFilePaths = (
  absolutePath: string,
  fileExtensionIgnores: FileExtension[],
  filePaths?: CssPath[],
): CssPath[] => {
  const filePathArray = filePaths ?? [];

  fs.readdirSync(absolutePath).forEach((item) => {
    const filepath = path.join(absolutePath, item);
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      getAllCssFilePaths(filepath, fileExtensionIgnores, filePathArray);
    }

    FILE_EXTENSIONS.forEach((extension) => {
      if (
        item.endsWith(`.${extension}`) &&
        !fileExtensionIgnores.includes(extension)
      ) {
        filePathArray.push({ path: filepath, type: extension });
      }
    });
  });
  return filePathArray;
};

const getFileContentsAsCss = async (cssPath: CssPath): Promise<string> => {
  switch (cssPath.type) {
    case 'css':
      return fs.readFileSync(cssPath.path, 'utf-8');
    case 'sass':
    case 'scss':
      return sass.compile(cssPath.path).css;
    case 'less':
      return (await less.render(fs.readFileSync(cssPath.path, 'utf-8'))).css;
  }
};

export const getAllCssFiles = async (
  absolutePath: string,
  fileExtensionIgnores: FileExtension[],
): Promise<CssFile[]> =>
  await Promise.all(
    getAllCssFilePaths(absolutePath, fileExtensionIgnores).map(
      async (cssPath) => ({
        ...cssPath,
        contents: await getFileContentsAsCss(cssPath),
      }),
    ),
  );
