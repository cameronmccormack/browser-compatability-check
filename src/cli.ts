import { getAllCssFiles } from './css-finder/get-all-css-files';
import * as csstree from 'css-tree';
import { getFormattedCss } from './css-parser/css-parser';
import { getCompatibilityReport } from './compatibility-report/get-compatibility-report';
import browserConfig from './browser-config.json';
import { CompatibilityReport } from './types/compatibility';
import { Browser } from './types/browser';
import logger from './logger';

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

  const reports: CompatibilityReport[] = [];
  cssFiles.forEach((file) => {
    const formattedCss = getFormattedCss(csstree.parse(file.contents));
    reports.push(
      getCompatibilityReport(formattedCss, browserConfig as Browser[]),
    );
  });

  if (
    reports.some(
      (report) =>
        report.unknownFeatures.length > 0 ||
        Object.values(report.browserSummaries).some(
          (browser) => browser.incompatible > 0,
        ),
    )
  ) {
    reports.forEach((report) => logger.error(JSON.stringify(report)));
    return exitWith(1);
  }

  return exitWith(0);
};
