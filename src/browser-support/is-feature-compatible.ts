import { getCssBrowserSupport } from './css-browser-support';
import { getIdFromFeature } from '../helpers/feature-id-helper';
import { Browser } from '../types/browser';
import { CssFeature } from '../types/css-feature';
import { Compatibility } from '../types/compatibility';

export const isFeatureCompatible = (
  feature: CssFeature,
  browsers: Browser[],
): Compatibility => {
  if (browsers.length === 0) {
    throw new Error('Missing browser config.');
  }

  const featureId = getIdFromFeature(feature);
  const browserSupport = getCssBrowserSupport(feature);

  if (!browserSupport) {
    console.log(`Could not identify CSS feature: ${featureId}.`);
    return 'unknown';
  }

  for (const browser of browsers) {
    const featureDetailsForBrowser = browserSupport[browser.identifier];

    if (!featureDetailsForBrowser) {
      throw new Error(
        `Browser ${browser.identifier} not found in support list for ${featureId}.`,
      );
    }

    // todo update this to search through the list
    const minimumBrowserVersion = Number(
      featureDetailsForBrowser[0].sinceVersion,
    );

    if (isNaN(minimumBrowserVersion)) {
      throw new Error(
        `Minimum version for ${browser.identifier} for ${featureId} cannot be converted to a number.`,
      );
    }

    if (browser.version < minimumBrowserVersion) {
      console.log(
        `Feature ${getIdFromFeature(feature)} is not supported on ${
          browser.identifier
        } version ${browser.version}`,
      );
      return 'incompatible';
    }
  }

  return 'compatible';
};
