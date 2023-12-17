import { BrowserSummaries, BrowserSummary } from '../../types/compatibility';
import { Rules } from '../../types/rules';
import {
  StyledBrowserSummary,
  StyledValue,
  TabulatedBrowserSummaries,
} from '../../types/tabulated-display-data';
import { getChalkStylesForStatus } from './chalk-helper';

export const getTabulatedBrowserSummaries = (
  browserSummaries: BrowserSummaries,
  rules: Rules,
): TabulatedBrowserSummaries =>
  Object.fromEntries(
    Object.entries(browserSummaries).map(([browserSlug, browserSummary]) => {
      return [
        browserSlug,
        getStyledBrowserCompatibility(browserSummary, rules),
      ];
    }),
  );

const getStyledBrowserCompatibility = (
  browserSummary: BrowserSummary,
  rules: Rules,
): StyledBrowserSummary => {
  const getStyledBrowserSummary = (
    compatibility: keyof BrowserSummary,
  ): StyledValue => ({
    value: browserSummary[compatibility].toString(),
    styles: getChalkStylesForStatus(
      browserSummary[compatibility] === 0 ? 'pass' : rules[compatibility],
    ),
  });

  return {
    compatible: getStyledBrowserSummary('compatible'),
    'partial-support': getStyledBrowserSummary('partial-support'),
    flagged: getStyledBrowserSummary('flagged'),
    incompatible: getStyledBrowserSummary('incompatible'),
    unknown: getStyledBrowserSummary('unknown'),
  };
};
