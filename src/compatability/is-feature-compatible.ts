import { cssBrowserSupport } from '../browser-support/css-browser-support';

type Browser = {
  identifier: string;
  version: number;
};

export const isFeatureCompatible = (
  featureIdentifier: string,
  browsers: Browser[],
): boolean => {
  const browserSupport = cssBrowserSupport([featureIdentifier])?.[
    featureIdentifier
  ];

  if (!browserSupport) {
    throw new Error('Could not identify any listed CSS features.');
  }

  for (const browser of browsers) {
    const featureDetailsForBrowser = browserSupport[browser.identifier];

    if (!featureDetailsForBrowser) {
      throw new Error(
        `Browser ${browser.identifier} not found in support list for ${featureIdentifier}`,
      );
    }

    const minimumBrowserVersion = Number(featureDetailsForBrowser.sinceVersion);

    if (isNaN(minimumBrowserVersion)) {
      throw new Error(
        `Minimum version for ${browser.identifier} for ${featureDetailsForBrowser} cannot be converted to a number.`,
      );
    }

    if (browser.version < minimumBrowserVersion) {
      console.log(
        `Feature ${featureIdentifier} is not supported on ${browser.identifier} version ${browser.version}`,
      );
      return false;
    }
  }

  return true;
};
