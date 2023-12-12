import { isFeatureCompatible } from '../browser-support/is-feature-compatible';
import { getIdFromFeature } from '../helpers/feature-id-helper';
import { Browser } from '../types/browser';
import {
  BrowserCompatibilityState,
  CompatibilityReport,
} from '../types/compatibility';
import { FormattedCss } from '../types/css-feature';
import { OverallResult } from '../types/overall-result';
import { Rules } from '../types/rules';

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

const BROWSER_LEVEL_COMPATIBILITIES: BrowserCompatibilityState[] = [
  'flagged',
  'partial-support',
  'incompatible',
  'unknown',
  'compatible',
];

const getOverallStatus = (
  report: CompatibilityReportWithoutOverallStatus,
  rules: Rules,
): OverallResult => {
  const overallResultOptions: OverallResult[] = [];

  if (report.unknownFeatures.length > 0) {
    overallResultOptions.push(rules['unknown-feature']);
  }

  const browserSummariesArray = Object.values(report.browserSummaries);

  BROWSER_LEVEL_COMPATIBILITIES.forEach((outcome) => {
    if (
      browserSummariesArray.some((statusCounts) => statusCounts[outcome] > 0)
    ) {
      overallResultOptions.push(rules[outcome]);
    }
  });

  if (overallResultOptions.length === 0) {
    // empty css file: TODO add config for this
    return 'pass';
  }

  if (overallResultOptions.includes('fail')) {
    return 'fail';
  } else if (overallResultOptions.includes('warn')) {
    return 'warn';
  } else {
    return 'pass';
  }
};

export const getCompatibilityReport = (
  formattedCss: FormattedCss,
  browserConfig: Browser[],
  filePath: string,
  rules: Rules,
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
    overallStatus: getOverallStatus(reportWithoutOverallStatus, rules),
  };
};
