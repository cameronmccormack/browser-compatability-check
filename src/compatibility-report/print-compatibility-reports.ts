/* eslint-disable no-console */
import { printTable } from '../table-printer/print-table';
import { CompatibilityReport } from '../types/compatibility';
import { OverallResult } from '../types/overall-result';

const MAX_WIDTH = 120;

const ASCII_KOMPAT = `
▄ •▄       • ▌ ▄ ·.  ▄▄▄· ▄▄▄· ▄▄▄▄▄
█▌▄▌▪▪     ·██ ▐███▪▐█ ▄█▐█ ▀█ •██  
▐▀▀▄· ▄█▀▄ ▐█ ▌▐▌▐█· ██▀·▄█▀▀█  ▐█.▪
▐█.█▌▐█▌.▐▌██ ██▌▐█▌▐█▪·•▐█ ▪▐▌ ▐█▌·
·▀  ▀ ▀█▄▀▪▀▀  █▪▀▀▀.▀    ▀  ▀  ▀▀▀ 

Copyright (c) 2023 Cameron McCormack
`.trim();

const printAsciiHeader = (): void => {
  console.log(`|${'-'.repeat(MAX_WIDTH - 2)}|`);
  ASCII_KOMPAT.split('\n').forEach((line) =>
    console.log(`|${padCenter(line, MAX_WIDTH - 2)}|`),
  );
  console.log(`|${'-'.repeat(MAX_WIDTH - 2)}|`);
};

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

const printOverallSummary = (
  reports: CompatibilityReport[],
  overallStatus: OverallResult,
): void => {
  console.log(`Overall Summary: ${overallStatus.toUpperCase()}`);
  reports.forEach((report) =>
    console.log(` - ${report.overallStatus.toUpperCase()}: ${report.filePath}`),
  );
};

const printBrowserSummaries = (report: CompatibilityReport): void => {
  printTable(report.browserSummaries, {
    characterWidth: MAX_WIDTH,
    headingText: 'High-level Summary',
  });
  printUnknownFeaturesFooter(report.unknownFeatures);
  printSpacer();
};

const printUnknownFeaturesFooter = (unknownFeatures: string[]): void => {
  console.log(`|${' '.repeat(MAX_WIDTH - 2)}|`);
  console.log(
    `| ${`Unknown features: ${unknownFeatures.length > 0 ? '' : 'None'}`.padEnd(
      MAX_WIDTH - 3,
    )}|`,
  );
  if (unknownFeatures.length > 0) {
    unknownFeatures.forEach((feature) =>
      console.log(`| - ${feature.padEnd(MAX_WIDTH - 5)}|`),
    );
  }
  console.log(`|${' '.repeat(MAX_WIDTH - 2)}|`);
  console.log(`|${'-'.repeat(MAX_WIDTH - 2)}|`);
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

  const browserSlugs = Object.keys(Object.values(tabulatedFeatures)[0]);

  // chunk the slugs into groups of 3, and print a table for each group - this
  // ensures the table is always legible at a width of 120 characters
  const chunkedSlugs = browserSlugs.reduce(
    (resultArray: string[][], item, index) => {
      const chunkIndex = Math.floor(index / 3);
      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [];
      }
      resultArray[chunkIndex].push(item);
      return resultArray;
    },
    [],
  );

  chunkedSlugs.forEach((slugs) => {
    const featuresForBrowser = Object.fromEntries(
      Object.entries(tabulatedFeatures).map(([feature, data]) => [
        feature,
        Object.fromEntries(slugs.map((slug) => [slug, data[slug]])),
      ]),
    );
    printTable(featuresForBrowser, {
      characterWidth: MAX_WIDTH,
      headingText: `Per-feature Summary (${slugs.join(', ')})`,
    });
    printSpacer();
  });
};

export const printCompatibilityReports = (
  reports: CompatibilityReport[],
  overallStatus: OverallResult,
): void => {
  printAsciiHeader();
  printSpacer();
  printOverallSummary(reports, overallStatus);
  printSpacer();
  console.log('Summary of all stylesheets:');
  reports.forEach((report) => {
    printReportHeading(report);
    printBrowserSummaries(report);
    if (
      report.overallStatus !== 'pass' &&
      Object.keys(report.knownFeatures).length > 0
    ) {
      printFeatureSummaries(report);
    }
  });
  printOverallSummary(reports, overallStatus);
};
