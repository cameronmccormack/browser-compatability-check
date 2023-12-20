import { OverallReport } from '../types/compatibility';
import { OutputReportFile } from '../types/report-options';
import jsonfile from 'jsonfile';
import pug from 'pug';
import fs from 'fs';

export const writeCompatibilityReportFiles = (
  report: OverallReport,
  outputReportFiles: OutputReportFile[],
): void => {
  outputReportFiles.forEach((fileSpec) => {
    switch (fileSpec.type) {
      case 'html':
        fs.writeFileSync(
          fileSpec.location,
          pug.compileFile('src/report-writers/templates/report.pug')(report),
        );
        break;
      case 'json':
        jsonfile.writeFileSync(fileSpec.location, report, { spaces: 2 });
    }
  });
};
