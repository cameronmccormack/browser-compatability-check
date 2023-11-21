import { BROWSER_SLUGS } from './browser-slugs';
import { FeatureSupport } from '../types/browser-support-types';
import {
  CssAtRule,
  CssFeature,
  CssProperty,
  CssSelector,
} from '../types/css-feature';
import { getCompatibilityData } from './bcd-data';
import {
  CompatStatement,
  Identifier,
  SupportBlock,
} from '@mdn/browser-compat-data/types';

const getCompatibilityStatement = (
  item: CssFeature,
): CompatStatement | null => {
  const { css } = getCompatibilityData();
  switch (item.type) {
    case 'property':
      return getCssPropertyCompatibilityStatement(item, css);
    case 'selector':
      return getCssSelectorCompatibilityStatement(item, css);
    case 'at-rule':
      return getCssAtRuleCompatibilityStatement(item, css);
    default:
      return null;
  }

  // if (item.identifier in css.properties) {
  // } else if (item.identifier in css.selectors) {
  // } else if (item.identifier in css.types) {
  //   return (
  //     css.types[item.identifier][item.value].__compat ??
  //     css.types[item.identifier].__compat ??
  //     null
  //   );
  // } else if (item.identifier in css.types.color) {
  //   return (
  //     css.types.color[item.identifier][item.value].__compat ??
  //     css.types.color[item.identifier].__compat ??
  //     null
  //   );
  // } else if (item.identifier in css['at-rules']) {
  //   return (
  //     css['at-rules'][item.identifier][item.value].__compat ??
  //     css['at-rules'][item.identifier].__compat ??
  //     null
  //   );
  // }
  // return null;
};

const getCssPropertyCompatibilityStatement = (
  item: CssProperty,
  css: Identifier,
): CompatStatement | null => {
  const itemWithContext =
    item.context && item.context in css.properties[item.identifier]
      ? css.properties[item.identifier][item.context]
      : css.properties[item.identifier];
  return (
    itemWithContext?.[item.value]?.__compat ?? itemWithContext?.__compat ?? null
  );
};

const getCssSelectorCompatibilityStatement = (
  item: CssSelector,
  css: Identifier,
): CompatStatement | null => css.selectors[item.identifier]?.__compat ?? null;

const getCssAtRuleCompatibilityStatement = (
  item: CssAtRule,
  css: Identifier,
): CompatStatement | null => css['at-rules'][item.identifier]?.__compat ?? null;

export const getCssBrowserSupport = (
  feature: CssFeature,
): FeatureSupport | null => {
  const compatibilityStatement = getCompatibilityStatement(feature);

  const report = {} as FeatureSupport;

  if (compatibilityStatement) {
    for (const browser of BROWSER_SLUGS) {
      const supportBrowser =
        compatibilityStatement.support[browser as keyof SupportBlock];
      const supportBrowserIsArray = Array.isArray(supportBrowser);

      if (
        supportBrowser === undefined ||
        (supportBrowserIsArray && supportBrowser.length === 0)
      ) {
        console.log(
          `No details found for browser ${browser} in compatibility data.`,
        );
        continue;
      }

      const versionAdded = supportBrowserIsArray
        ? supportBrowser[0].version_added
        : supportBrowser.version_added;
      const isFlagged = Boolean(
        supportBrowserIsArray
          ? supportBrowser[1].flags?.length // todo why is this [1]?
          : supportBrowser?.flags?.length,
      );

      const sinceVersion = versionAdded
        ? Number(versionAdded)
        : Number.POSITIVE_INFINITY;
      if (isNaN(sinceVersion)) {
        console.log(
          `Browser version ${sinceVersion} is not a number for ${browser}`,
        );
      } else {
        report[browser] = {
          sinceVersion: sinceVersion,
          flagged: isFlagged,
        };
      }
    }
  }

  return Object.keys(report).length > 0 ? report : null;
};
