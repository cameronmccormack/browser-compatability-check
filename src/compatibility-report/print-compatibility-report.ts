/* eslint-disable no-console */
import { CompatibilityReport } from '../types/compatibility';

const printSpacer = (): void => {
  console.log('\n');
};

const printOverallSummary = (report: CompatibilityReport): void => {
  console.log(`${report.overallStatus.toUpperCase()}: ${report.filePath}`);
  printSpacer();
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

export const printCompatibilityReport = (
  report: CompatibilityReport,
  mode: 'full' | 'concise',
): void => {
  printOverallSummary(report);
  printBrowserSummaries(report);
  if (mode === 'full') {
    printFeatureSummaries(report);
  }
};
