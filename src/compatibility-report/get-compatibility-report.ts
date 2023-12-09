import { isFeatureCompatible } from '../browser-support/is-feature-compatible';
import { getIdFromFeature } from '../helpers/feature-id-helper';
import { Browser } from '../types/browser';
import { CompatibilityReport } from '../types/compatibility';
import { FormattedCss } from '../types/css-feature';

const INITIAL_BROWSER_SUMMARY = {
  compatible: 0,
  'partial-support': 0,
  flagged: 0,
  incompatible: 0,
  unknown: 0,
};

type CompatibilityReportWithoutOverallStatus = Omit<
  CompatibilityReport,
  'overallStatus'
>;

const getOverallStatus = (
  report: CompatibilityReportWithoutOverallStatus,
): 'pass' | 'fail' | 'warn' => {
  if (report.unknownFeatures.length > 0) {
    return 'fail';
  }

  const browserSummariesArray = Object.values(report.browserSummaries);

  if (
    browserSummariesArray.some((statusCounts) => statusCounts.incompatible > 0)
  ) {
    return 'fail';
  }

  if (
    browserSummariesArray.some(
      (statusCounts) =>
        statusCounts['partial-support'] > 0 ||
        statusCounts.flagged > 0 ||
        statusCounts.unknown > 0,
    )
  ) {
    return 'warn';
  }

  return 'pass';
};

export const getCompatibilityReport = (
  formattedCss: FormattedCss,
  browserConfig: Browser[],
  filePath: string,
): CompatibilityReport => {
  const reportWithoutOverallStatus: CompatibilityReportWithoutOverallStatus = {
    filePath,
    knownFeatures: {},
    unknownFeatures: [],
    browserSummaries: Object.fromEntries(
      browserConfig.map((browser) => [
        browser.identifier,
        { ...INITIAL_BROWSER_SUMMARY },
      ]),
    ),
  };

  Object.values(formattedCss).forEach((featureArray) =>
    featureArray.forEach((feature) => {
      const featureId = getIdFromFeature(feature);
      const compatibility = isFeatureCompatible(feature, browserConfig);
      if (compatibility === 'unknown-feature') {
        reportWithoutOverallStatus.unknownFeatures.push(featureId);
      } else {
        reportWithoutOverallStatus.knownFeatures[featureId] = compatibility;
        Object.keys(compatibility).forEach((browser) => {
          reportWithoutOverallStatus.browserSummaries[browser][
            compatibility[browser].compatibility
          ] += 1;
        });
      }
    }),
  );

  return {
    ...reportWithoutOverallStatus,
    overallStatus: getOverallStatus(reportWithoutOverallStatus),
  };
};
