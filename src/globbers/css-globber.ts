import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'sass';
import less from 'less';
import { CssPath, CssFile } from '../types/css-file';
import { FILE_EXTENSIONS, FileExtension } from '../helpers/filetype-helper';
import { InternalError } from '../errors/internal-error';
import { sassTildeCustomImporter } from './custom-importers';

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

const getFileContentsAsCss = async (
  cssPath: CssPath,
  lessSourceDirectories: string[],
): Promise<string> => {
  try {
    switch (cssPath.type) {
      case 'css':
        return fs.readFileSync(cssPath.path, 'utf-8');
      case 'sass':
      case 'scss':
        return sass.compile(cssPath.path, {
          importers: [sassTildeCustomImporter],
        }).css;
      case 'less':
        // TODO: think about applicability/functionality of LESS tilde imports
        return (
          await less.render(fs.readFileSync(cssPath.path, 'utf-8'), {
            paths: lessSourceDirectories,
          })
        ).css;
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new InternalError(`Error in file ${cssPath.path}:\n\n${e.message}`);
    }
    throw e;
  }
};

export const getAllCssFiles = async (
  absolutePath: string,
  fileExtensionIgnores: FileExtension[],
): Promise<CssFile[]> => {
  const cssFilePaths = getAllCssFilePaths(absolutePath, fileExtensionIgnores);
  const lessPaths = cssFilePaths
    .filter((cssFilePath) => cssFilePath.type === 'less')
    .map((lessFilePath) => lessFilePath.path);
  const lessSourceDirectories = [
    ...new Set(lessPaths.map((lessPath) => path.dirname(lessPath))),
  ];

  return await Promise.all(
    cssFilePaths.map(async (cssFilePath) => ({
      ...cssFilePath,
      contents: await getFileContentsAsCss(cssFilePath, lessSourceDirectories),
    })),
  );
};
