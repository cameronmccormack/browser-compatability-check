import { getAllCssFiles } from './css-finder/get-all-css-files';
import * as csstree from 'css-tree';
import { getFormattedCss } from './css-parser/css-parser';
import { getCompatibilityReport } from './compatibility-report/get-compatibility-report';
import browserConfig from './browser-config.json';
import { CompatibilityReport } from './types/compatibility';
import { Browser } from './types/browser';
import { printCompatibilityReport } from './compatibility-report/print-compatibility-report';

export enum ExitCode {
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

  const reports: CompatibilityReport[] = [];
  cssFiles.forEach((file) => {
    const formattedCss = getFormattedCss(csstree.parse(file.contents));
    reports.push(
      getCompatibilityReport(
        formattedCss,
        browserConfig as Browser[],
        file.path,
      ),
    );
  });

  reports.forEach((report) =>
    printCompatibilityReport(
      report,
      report.overallStatus === 'pass' ? 'concise' : 'full',
    ),
  );

  if (reports.some((report) => report.overallStatus === 'fail')) {
    return exitWith(1);
  }

  return exitWith(0);
};
