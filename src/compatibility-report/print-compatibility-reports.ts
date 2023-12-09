/* eslint-disable no-console */
import { CompatibilityReport } from '../types/compatibility';

const MAX_WIDTH = 120;

const ASCII_KOMPAT = `
▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄
█▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██  
▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪
▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·
·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀ 
Copyright (c) 2023 Cameron McCormack
`;

const padCenter = (str: string, maxLength: number): string =>
  str.padStart((str.length + maxLength) / 2).padEnd(maxLength);

const printSpacer = (): void => {
  console.log('\n');
};

const printReportHeading = (report: CompatibilityReport): void => {
  const summaryText = `${report.overallStatus.toUpperCase()}: ${
    report.filePath
  }`;
  console.log(`
${'#'.repeat(MAX_WIDTH)}
#${' '.repeat(MAX_WIDTH - 2)}#
# ${padCenter(summaryText, MAX_WIDTH - 4)} #
#${' '.repeat(MAX_WIDTH - 2)}#
${'#'.repeat(MAX_WIDTH)}
`);
};

const printOverallSummary = (reports: CompatibilityReport[]): void => {
  console.log(ASCII_KOMPAT);
  console.log('Overall Summary:');
  reports.forEach((report) =>
    console.log(` - ${report.overallStatus.toUpperCase()}: ${report.filePath}`),
  );
};

const printBrowserSummaries = (report: CompatibilityReport): void => {
  console.log('High-level summary:');
  console.table(report.browserSummaries);
  console.log('Unknown features:');
  report.unknownFeatures.length > 0
    ? report.unknownFeatures.forEach((feature) => console.log(` - ${feature}`))
    : console.log('None');
  printSpacer();
};

const printFeatureSummaries = (report: CompatibilityReport): void => {
  const tabulatedFeatures = Object.fromEntries(
    Object.keys(report.knownFeatures)
      .sort()
      .map((featureKey) => [
        featureKey,
        Object.fromEntries(
          Object.keys(report.knownFeatures[featureKey]).map((browserKey) => [
            browserKey,
            report.knownFeatures[featureKey][browserKey].compatibility,
          ]),
        ),
      ]),
  );

  console.log('Per-feature summary:');
  console.table(tabulatedFeatures);
  printSpacer();
};

export const printCompatibilityReports = (
  reports: CompatibilityReport[],
): void => {
  printOverallSummary(reports);
  reports.forEach((report) => {
    printReportHeading(report);
    printBrowserSummaries(report);
    if (report.overallStatus !== 'pass') {
      printFeatureSummaries(report);
    }
  });
};
