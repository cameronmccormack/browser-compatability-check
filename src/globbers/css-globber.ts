import * as fs from 'fs';
import * as path from 'path';
import * as sass from 'sass';
import less from 'less';
import { CssPath, CssFile } from '../types/css-file';

const getAllCssFilePaths = (
  absolutePath: string,
  filePaths?: CssPath[],
): CssPath[] => {
  const filePathArray = filePaths ?? [];

  fs.readdirSync(absolutePath).forEach((item) => {
    const filepath = path.join(absolutePath, item);
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      getAllCssFilePaths(filepath, filePathArray);
    } else if (item.endsWith('.css')) {
      filePathArray.push({ path: filepath, type: 'css' });
    } else if (item.endsWith('.scss')) {
      filePathArray.push({ path: filepath, type: 'scss' });
    } else if (item.endsWith('.sass')) {
      filePathArray.push({ path: filepath, type: 'sass' });
    } else if (item.endsWith('.less')) {
      filePathArray.push({ path: filepath, type: 'less' });
    }
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
): Promise<CssFile[]> =>
  await Promise.all(
    getAllCssFilePaths(absolutePath).map(async (cssPath) => ({
      ...cssPath,
      contents: await getFileContentsAsCss(cssPath),
    })),
  );
