import { CompatibilityReport } from '../../types/compatibility';
import { Rules } from '../../types/rules';
import { TabulatedFeatures } from '../../types/tabulated-display-data';
import { getChalkStylesForStatus } from './chalk-helper';

export const getTabulatedFeatures = (
  features: CompatibilityReport['knownFeatures'],
  rules: Rules,
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
            const { compatibility } = features[featureKey][browserKey];
            return [
              browserKey,
              {
                value: compatibility,
                styles: getChalkStylesForStatus(rules[compatibility]),
              },
            ];
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
