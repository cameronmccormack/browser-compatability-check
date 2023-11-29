import { isFeatureCompatible } from '../browser-support/is-feature-compatible';
import { getIdFromFeature } from '../helpers/feature-id-helper';
import { Browser } from '../types/browser';
import { CompatibilityReport } from '../types/compatibility';
import { FormattedCss } from '../types/css-feature';

const INITIAL_BROWSER_SUMMARY = {
  total: 0,
  compatible: 0,
  'partial-support': 0,
  flagged: 0,
  incompatible: 0,
  unknown: 0,
};

export const getCompatibilityReport = (
  formattedCss: FormattedCss,
  browserConfig: Browser[],
): CompatibilityReport => {
  const report: CompatibilityReport = {
    knownFeatures: {},
    unknownFeatures: [],
    browserSummaries: Object.fromEntries(
      browserConfig.map((browser) => [
        browser.identifier,
        INITIAL_BROWSER_SUMMARY,
      ]),
    ),
  };

  Object.values(formattedCss).forEach((featureArray) =>
    featureArray.forEach((feature) => {
      const featureId = getIdFromFeature(feature);
      const compatibility = isFeatureCompatible(feature, browserConfig);
      if (compatibility === 'unknown-feature') {
        report.unknownFeatures.push(featureId);
      } else {
        report.knownFeatures[featureId] = compatibility;
        Object.keys(compatibility).forEach((browser) => {
          report.browserSummaries[browser][
            compatibility[browser].compatibility
          ] += 1;
        });
      }
    }),
  );

  return report;
};
