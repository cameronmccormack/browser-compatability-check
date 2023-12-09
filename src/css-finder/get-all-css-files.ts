import * as fs from 'fs';
import * as path from 'path';
import { CssFile } from '../types/css-file';

const getAllCssFilePaths = (
  absolutePath: string,
  filePaths?: string[],
): string[] => {
  const filePathArray = filePaths ?? [];

  fs.readdirSync(absolutePath).forEach((item) => {
    const filepath = path.join(absolutePath, item);
    const stat = fs.lstatSync(filepath);
    if (stat.isDirectory()) {
      getAllCssFilePaths(filepath, filePathArray);
    } else if (item.endsWith('.css')) {
      filePathArray.push(filepath);
    }
  });

  return filePathArray;
};

export const getAllCssFiles = (absolutePath: string): CssFile[] =>
  getAllCssFilePaths(absolutePath).map((path) => ({
    path,
    contents: fs.readFileSync(path, 'utf-8'),
  }));
