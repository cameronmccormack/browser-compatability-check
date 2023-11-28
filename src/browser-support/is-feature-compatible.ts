import { getCssBrowserSupport } from './css-browser-support';
import { getIdFromFeature } from '../helpers/feature-id-helper';
import { Browser } from '../types/browser';
import { CssFeature } from '../types/css-feature';
import { BrowserCompatibility, Compatibility } from '../types/compatibility';
import { FeatureDetailsForBrowser } from '../types/browser-support-types';

const getCompatibilityForBrowser = (
  browser: Browser,
  featureDetailsForBrowser: FeatureDetailsForBrowser,
): BrowserCompatibility => {
  const relevantFeature = featureDetailsForBrowser
    .sort((a, b) => {
      const aValue = a.untilVersion ?? a.sinceVersion;
      const bValue = b.untilVersion ?? b.sinceVersion;

      // where latest referenced versions are equal (an expected case as compatibility changes over time),
      // prioritize the object without an untilVersion as this will reflect the current state of the compatibility
      if (aValue === bValue) {
        return a.untilVersion ? 1 : -1;
      }

      return bValue - aValue;
    })
    .find(
      (item) =>
        (item.untilVersion && item.untilVersion <= browser.version) ||
        item.sinceVersion <= browser.version,
    );

  if (!relevantFeature) {
    return { compatibility: 'incompatible' };
  }

  if (
    relevantFeature.untilVersion &&
    relevantFeature.untilVersion < browser.version
  ) {
    return { compatibility: 'incompatible' };
  }

  if (relevantFeature.isFlagged) {
    return { compatibility: 'flagged', notes: relevantFeature.notes };
  }

  if (relevantFeature.isPartialSupport) {
    return { compatibility: 'partial-support', notes: relevantFeature.notes };
  }

  return { compatibility: 'compatible' };
};

export const isFeatureCompatible = (
  feature: CssFeature,
  browsers: Browser[],
): Compatibility | 'unknown-feature' => {
  if (browsers.length === 0) {
    throw new Error('Missing browser config.');
  }

  const featureId = getIdFromFeature(feature);
  const browserSupport = getCssBrowserSupport(feature);

  if (!browserSupport) {
    console.log(`Could not identify CSS feature: ${featureId}.`);
    return 'unknown-feature';
  }

  const compatibility: Compatibility = {};

  browsers.forEach((browser) => {
    const featureDetailsForBrowser = browserSupport[browser.identifier];
    compatibility[browser.identifier] = featureDetailsForBrowser
      ? getCompatibilityForBrowser(browser, featureDetailsForBrowser)
      : { compatibility: 'unknown' };
  });

  return compatibility;
};
