import * as bcd from '@mdn/browser-compat-data';
import { ItemType } from '../types/mdn-types';
import { BROWSER_SLUGS } from './browser-slugs';
import { BrowserSupport, FeatureSupport } from '../types/browser-support-types';

// TODO refactor this and remove magic array duplication
const GAP = 'gap';
const GAP_FLEXBOX = 'gap - flexbox';
const GAP_GRID = 'gap - grid';
const GAP_REPLACEMENTS = [GAP_FLEXBOX, GAP_GRID];

const getFeatureIdentifiersWithGapReplaced = (features: string[]): string[] => {
  const gapIndex = features.indexOf(GAP);
  if (gapIndex >= 0) {
    features.splice(gapIndex, 1, ...GAP_REPLACEMENTS);
  }
  return features;
};

const getItemType = (item: string): ItemType | null => {
  // TODO check the types returned here are all ok
  if (GAP_REPLACEMENTS.includes(item)) {
    switch (item) {
      case GAP_FLEXBOX:
        return { [item]: bcd.css.properties.gap.flex_context };
      case GAP_GRID:
        return { [item]: bcd.css.properties.gap.grid_context };
      default:
      // no-op
    }
  } else if (item in bcd.css.properties) {
    return { [item]: bcd.css.properties[item] };
  } else if (item in bcd.css.properties['grid-template-columns']) {
    return bcd.css.properties['grid-template-columns'];
  } else if (item in bcd.css.selectors) {
    return bcd.css.selectors;
  } else if (item in bcd.css.types) {
    return bcd.css.types;
  } else if (item in bcd.css.types.color) {
    return bcd.css.types.color;
  } else if (item in bcd.css['at-rules']) {
    return bcd.css['at-rules'];
  }
  return null;
};

const getWorstCaseGapSupport = (report: BrowserSupport): FeatureSupport => {
  const worstCaseGapSupport = {} as FeatureSupport;
  const gapSupportCases = GAP_REPLACEMENTS.map(
    (feature) => report[feature],
  ).filter(Boolean);
  for (const browser of BROWSER_SLUGS) {
    worstCaseGapSupport[browser] = gapSupportCases
      .filter((supportCase) => supportCase[browser])
      .sort((a, b) => a[browser].sinceVersion - b[browser].sinceVersion)[0]?.[
      browser
    ];
  }
  return worstCaseGapSupport;
};

export const cssBrowserSupport = (
  featureIdentifiers: string[],
): BrowserSupport | null => {
  const report = {} as BrowserSupport;
  const trimmedUniqueFeatureIdentifiers = [
    ...new Set(featureIdentifiers.map((item) => item.trim())),
  ];
  const includesGap = trimmedUniqueFeatureIdentifiers.includes(GAP);

  const featureIdentifiersWithGapHandled = includesGap
    ? getFeatureIdentifiersWithGapReplaced(trimmedUniqueFeatureIdentifiers)
    : trimmedUniqueFeatureIdentifiers;

  for (const item of featureIdentifiersWithGapHandled) {
    const cleanedItem = item.trim().replace(/@|:|\(|\)*/g, '');
    const itemType = getItemType(cleanedItem);

    if (itemType) {
      report[cleanedItem] = {} as FeatureSupport;
      for (const browser of BROWSER_SLUGS) {
        const supportBrowser = itemType[cleanedItem].__compat.support[browser];
        const supportBrowserIsArray = Array.isArray(supportBrowser);

        const versionAdded = supportBrowserIsArray
          ? supportBrowser[0].version_added
          : supportBrowser.version_added;
        const isFlagged = Boolean(
          supportBrowserIsArray
            ? supportBrowser[1].flags
            : supportBrowser.flags,
        );

        const sinceVersion = Number(versionAdded);
        if (isNaN(sinceVersion)) {
          console.log(
            `Browser version ${sinceVersion} is not a number for ${browser}`,
          );
        } else {
          report[cleanedItem][browser] = {
            sinceVersion: Number(versionAdded),
            flagged: isFlagged,
          };
        }
      }
    }
  }

  if (includesGap) {
    report[GAP] = getWorstCaseGapSupport(report);
  }

  return Object.keys(report).length > 0 ? report : null;
};
