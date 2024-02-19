/* eslint-disable no-console */
import { CompatibilityReport, OverallReport } from '../types/compatibility';
import { OverallResult } from '../types/overall-result';
import { getChunkedArray } from '../helpers/array-helper';
import { Rules } from '../types/rules';
import { printTable } from './table-printer/print-table';
import {
  printFullWidthCharacterRow,
  printFullWidthRowWithText,
  printSingleColumnTableDivider,
  printSingleColumnTableSpacer,
} from './helpers/table-helper';
import {
  getFeaturesForSpecifiedBrowserSlugs,
  getTabulatedFeatures,
} from './helpers/feature-summary-helper';
import {
  CHALK_STYLES,
  applyChalkStyles,
  getChalkStylesForStatus,
  getStyledOverallStatus,
} from './helpers/chalk-helper';
import { getTabulatedBrowserSummaries } from './helpers/browser-summary-helper';

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
  console.log(`Overall Summary: ${getStyledOverallStatus(overallStatus)}`);
  reports.forEach((report) =>
    console.log(
      ` - ${getStyledOverallStatus(report.overallStatus)}: ${report.filePath}`,
    ),
  );
};

const printReportSummaries = (
  reports: CompatibilityReport[],
  rules: Rules,
  includePerFeatureSummary: boolean,
): void => {
  console.log('Summary of all stylesheets:');
  reports.forEach((report) => {
    printReportHeading(report);
    printBrowserSummaries(report, rules);
    if (
      includePerFeatureSummary &&
      report.overallStatus !== 'pass' &&
      Object.keys(report.knownFeatures).length > 0
    ) {
      printFeatureSummaries(report, rules);
    }
    if (report.cssParsingErrors.length > 0) {
      printCssParsingErrors(report.cssParsingErrors);
    }
  });
};

const printReportHeading = (report: CompatibilityReport): void => {
  const summaryText = `${report.overallStatus.toUpperCase()}: ${
    report.filePath
  }`;

  printFullWidthCharacterRow('#', MAX_WIDTH);
  printSingleColumnTableSpacer(MAX_WIDTH, '#');
  printFullWidthRowWithText(
    summaryText,
    MAX_WIDTH,
    { edgeCharacter: '#' },
    getChalkStylesForStatus(
      report.overallStatus,
      report.overallStatus === 'pass' ? 'low' : 'high',
    ),
  );
  printSingleColumnTableSpacer(MAX_WIDTH, '#');
  printFullWidthCharacterRow('#', MAX_WIDTH);
};

const printBrowserSummaries = (
  report: CompatibilityReport,
  rules: Rules,
): void => {
  const tabulatedBrowserSummaries = getTabulatedBrowserSummaries(
    report.browserSummaries,
    rules,
  );
  printTable(tabulatedBrowserSummaries, {
    characterWidth: MAX_WIDTH,
    headingText: 'High-level Summary',
  });
  printUnknownFeaturesFooter(report.unknownFeatures, rules);
  printSpacer();
};

const printUnknownFeaturesFooter = (
  unknownFeatures: string[],
  rules: Rules,
): void => {
  const hasUnknownFeatures = unknownFeatures.length > 0;
  const unknownFeaturesChalkStyles = getChalkStylesForStatus(
    rules['unknown-feature'],
  );
  printSingleColumnTableSpacer(MAX_WIDTH);
  printFullWidthRowWithText(
    `Unknown features:${hasUnknownFeatures ? '' : ' None'}`,
    MAX_WIDTH,
    { justification: 'left' },
    hasUnknownFeatures
      ? unknownFeaturesChalkStyles
      : getChalkStylesForStatus('pass'),
  );
  if (unknownFeatures.length > 0) {
    unknownFeatures.forEach((feature) =>
      printFullWidthRowWithText(
        `- ${feature}`,
        MAX_WIDTH,
        {
          justification: 'left',
        },
        unknownFeaturesChalkStyles,
      ),
    );
  }
  printSingleColumnTableSpacer(MAX_WIDTH);
  printSingleColumnTableDivider(MAX_WIDTH);
};

const printFeatureSummaries = (
  report: CompatibilityReport,
  rules: Rules,
): void => {
  const { tabulatedFeatures, browserSlugs } = getTabulatedFeatures(
    report.knownFeatures,
    rules,
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

const printCssParsingErrors = (parsingErrors: string[]): void => {
  console.log(
    applyChalkStyles(
      'CSS Parsing Errors (bad content wrapped in Raw by default):',
      CHALK_STYLES.warn.high,
    ),
  );
  parsingErrors.forEach((error) => {
    console.log(applyChalkStyles(error, CHALK_STYLES.warn.low));
    printSpacer();
  });
};

const printSpacer = (): void => {
  console.log('\n');
};

export const printCompatibilityReports = ({
  reports,
  overallResult,
  rules,
  includePerFeatureSummary,
}: OverallReport): void => {
  printAsciiHeader();
  printSpacer();
  printOverallSummary(reports, overallResult);
  printSpacer();
  printReportSummaries(reports, rules, includePerFeatureSummary);
  printOverallSummary(reports, overallResult);
};
