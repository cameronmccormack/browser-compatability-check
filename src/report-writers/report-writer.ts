import fs from 'fs';
import path from 'path';
import jsonfile from 'jsonfile';
import pug from 'pug';
import { OverallReport } from '../types/compatibility';
import { OutputReportFile } from '../types/report-options';

const createDirectoryIfNotExists = (filepath: string): void => {
  const directoryPath = filepath.split('/').slice(0, -1).join('/');
  try {
    fs.mkdirSync(directoryPath, { recursive: true });
  } catch {
    // do nothing - it's fine if the directory already exists
  }
};

const copyStaticAssets = (fileLocation: string): void => {
  const staticFileDirectoryPath =
    fileLocation.split('/').slice(0, -1).join('/') + '/static';

  try {
    fs.mkdirSync(staticFileDirectoryPath);
  } catch {
    // do nothing - it's fine if the directory already exists
  }

  fs.copyFileSync(
    path.join(__dirname, '../../images/logo-text.svg'),
    `${staticFileDirectoryPath}/logo.svg`,
  );
};

export const writeCompatibilityReportFiles = (
  report: OverallReport,
  outputReportFileSpecifications: OutputReportFile[],
): void => {
  outputReportFileSpecifications.forEach((fileSpec) => {
    createDirectoryIfNotExists(fileSpec.location);
    switch (fileSpec.type) {
      case 'html':
        fs.writeFileSync(
          fileSpec.location,
          pug.compileFile(`${__dirname}/templates/report.pug`)(report),
        );
        copyStaticAssets(fileSpec.location);
        break;
      case 'json':
        jsonfile.writeFileSync(fileSpec.location, report, { spaces: 2 });
    }
  });
};
