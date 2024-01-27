import * as fs from 'fs';
import * as path from 'path';
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
    }
  });

  return filePathArray;
};

export const getAllCssFiles = (absolutePath: string): CssFile[] | null => {
  try {
    return getAllCssFilePaths(absolutePath).map((cssPath) => ({
      ...cssPath,
      contents: fs.readFileSync(cssPath.path, 'utf-8'),
    }));
  } catch {
    return null;
  }
};
