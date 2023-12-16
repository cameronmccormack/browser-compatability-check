import { CompatibilityReport } from '../../types/compatibility';
import { BrowserCompatibilityState } from '../../types/compatibility';

type TabulatedFeatures = {
  [feature: string]: {
    [browser: string]: BrowserCompatibilityState;
  };
};

export const getTablulatedFeatures = (
  features: CompatibilityReport['knownFeatures'],
): { tabulatedFeatures: TabulatedFeatures; browserSlugs: string[] } => {
  const browserSlugs = new Set<string>();
  const tabulatedFeatures = Object.fromEntries(
    Object.keys(features)
      .sort()
      .map((featureKey) => [
        featureKey,
        Object.fromEntries(
          Object.keys(features[featureKey]).map((browserKey) => {
            browserSlugs.add(browserKey);
            return [browserKey, features[featureKey][browserKey].compatibility];
          }),
        ),
      ]),
  );
  return {
    tabulatedFeatures,
    browserSlugs: Array.from(browserSlugs),
  };
};

export const getFeaturesForSpecifiedBrowserSlugs = (
  allFeatures: TabulatedFeatures,
  browserSlugs: string[],
): TabulatedFeatures =>
  Object.fromEntries(
    Object.entries(allFeatures).map(([feature, data]) => [
      feature,
      Object.fromEntries(browserSlugs.map((slug) => [slug, data[slug]])),
    ]),
  );
