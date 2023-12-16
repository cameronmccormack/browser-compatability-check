/* eslint-disable no-console */
import { printTable } from './table-printer/print-table';
import { CompatibilityReport } from '../types/compatibility';
import { OverallResult } from '../types/overall-result';
import {
  printFullWidthCharacterRow,
  printFullWidthRowWithText,
  printSingleColumnTableDivider,
  printSingleColumnTableSpacer,
} from './helpers/table-helper';
import {
  getFeaturesForSpecifiedBrowserSlugs,
  getTablulatedFeatures,
} from './helpers/feature-summary-helper';
import { getChunkedArray } from '../helpers/array-helper';

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
  printSingleColumnTableDivider(MAX_WIDTH);
  ASCII_KOMPAT.split('\n').forEach((line) =>
    printFullWidthRowWithText(line, MAX_WIDTH),
  );
  printSingleColumnTableDivider(MAX_WIDTH);
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

const printReportSummaries = (reports: CompatibilityReport[]): void => {
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
};

const printReportHeading = (report: CompatibilityReport): void => {
  const summaryText = `${report.overallStatus.toUpperCase()}: ${
    report.filePath
  }`;

  printFullWidthCharacterRow('#', MAX_WIDTH);
  printSingleColumnTableSpacer(MAX_WIDTH, '#');
  printFullWidthRowWithText(summaryText, MAX_WIDTH, { edgeCharacter: '#' });
  printSingleColumnTableSpacer(MAX_WIDTH, '#');
  printFullWidthCharacterRow('#', MAX_WIDTH);
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
  printSingleColumnTableSpacer(MAX_WIDTH);
  printFullWidthRowWithText(
    `Unknown features:${unknownFeatures.length > 0 ? '' : ' None'}`,
    MAX_WIDTH,
    { justification: 'left' },
  );
  if (unknownFeatures.length > 0) {
    unknownFeatures.forEach((feature) =>
      printFullWidthRowWithText(`- ${feature}`, MAX_WIDTH, {
        justification: 'left',
      }),
    );
  }
  printSingleColumnTableSpacer(MAX_WIDTH);
  printSingleColumnTableDivider(MAX_WIDTH);
};

const printFeatureSummaries = (report: CompatibilityReport): void => {
  const { tabulatedFeatures, browserSlugs } = getTablulatedFeatures(
    report.knownFeatures,
  );

  // only include max 3 browsers per table, to ensure legibility
  const chunkedSlugs = getChunkedArray(browserSlugs, 3);
  chunkedSlugs.forEach((slugs) => {
    const featuresForBrowser = getFeaturesForSpecifiedBrowserSlugs(
      tabulatedFeatures,
      slugs,
    );
    printTable(featuresForBrowser, {
      characterWidth: MAX_WIDTH,
      headingText: `Per-feature Summary (${slugs.join(', ')})`,
    });
    printSpacer();
  });
};

const printSpacer = (): void => {
  console.log('\n');
};

export const printCompatibilityReports = (
  reports: CompatibilityReport[],
  overallStatus: OverallResult,
): void => {
  printAsciiHeader();
  printSpacer();
  printOverallSummary(reports, overallStatus);
  printSpacer();
  printReportSummaries(reports);
  printOverallSummary(reports, overallStatus);
};
