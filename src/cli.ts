import { main } from '.';
import { getAllCssFiles } from './css-finder/get-all-css-files';
import * as csstree from 'css-tree';
import { getFormattedCss } from './css-parser/css-parser';

enum ExitCode {
  Compatible = 0,
  Incompatible = 1,
  BadArgsOrException = 2,
}

export const runCli = (
  exitWith: (code: ExitCode) => ExitCode,
  relativePath?: string,
): ExitCode => {
  const formattedPath = relativePath?.replaceAll(/\/+$|^\.\//g, '');
  const absolutePath = `${process.cwd()}${
    formattedPath ? `/${formattedPath}` : ''
  }`;

  const cssFiles = getAllCssFiles(absolutePath);

  cssFiles.forEach((file) => {
    const parsedCss = csstree.parse(file);
    const formattedCss = getFormattedCss(parsedCss);
    main(formattedCss);
  });

  return exitWith(0);
};
