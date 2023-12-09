/* eslint-disable no-console */
import { CompatibilityReport } from '../types/compatibility';

const printOverallSummary = (report: CompatibilityReport): void => {
  console.log(`${report.overallStatus.toUpperCase()}: ${report.filePath}`);
};

const printBrowserSummaries = (report: CompatibilityReport): void => {
  console.log('High-level summary:');
  console.table(report.browserSummaries);
  console.log('Unknown features:');
  report.unknownFeatures.length > 0
    ? report.unknownFeatures.forEach((feature) => console.log(` - ${feature}`))
    : console.log('None');
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
};

const printSpacer = (): void => {
  console.log('\n');
};

export const printCompatibilityReport = (
  report: CompatibilityReport,
  mode: 'full' | 'concise',
): void => {
  printOverallSummary(report);
  printSpacer();
  printBrowserSummaries(report);
  if (mode === 'full') {
    printSpacer();
    printFeatureSummaries(report);
  }
  printSpacer();
};
