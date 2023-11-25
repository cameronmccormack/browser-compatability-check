import { BROWSER_SLUGS } from './browser-slugs';
import { FeatureSupport } from '../types/browser-support-types';
import {
  CssAtRule,
  CssFeature,
  CssFunction,
  CssProperty,
  CssSelector,
} from '../types/css-feature';
import { getCompatibilityData } from './bcd-data';
import {
  CompatStatement,
  Identifier,
  VersionValue,
} from '@mdn/browser-compat-data/types';
import { findCompatNode } from './find-compat-node';

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
    case 'function':
      return getCssFunctionCompatibilityStatement(item, css);
    default:
      return null;
  }
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

const getCssFunctionCompatibilityStatement = (
  item: CssFunction,
  css: Identifier,
): CompatStatement | null => {
  const compatibilityStatementFromTypesData = findCompatNode(
    item.identifier,
    css.types,
  );

  return (
    compatibilityStatementFromTypesData ??
    css.properties['custom-property'][item.identifier]?.__compat ??
    null
  );
};

const getNumericVersion = (
  rawVersion: VersionValue,
  browser: string,
): number => {
  const version =
    typeof rawVersion === 'string' ? rawVersion.replace('≤', '') : rawVersion;

  const numericVersion = version ? Number(version) : Number.POSITIVE_INFINITY;
  if (isNaN(numericVersion)) {
    throw new Error(
      `Browser version ${version} could not be converted to a number for ${browser}`,
    );
  }

  return numericVersion;
};

const removeUndefinedValues = <T>(value: T | undefined): value is T =>
  value !== undefined;

export const getCssBrowserSupport = (
  feature: CssFeature,
): FeatureSupport | null => {
  const compatibilityStatement = getCompatibilityStatement(feature);

  const report = {} as FeatureSupport;

  if (compatibilityStatement) {
    for (const browser of BROWSER_SLUGS) {
      const supportBrowser = compatibilityStatement.support[browser];
      const supportBrowserAsArray = (
        Array.isArray(supportBrowser) ? supportBrowser : [supportBrowser]
      )
        .filter(removeUndefinedValues)
        // remove prefixed values - these are separate CSS features and lead to nonsensical
        // compatibility versions if included due to overlap with the non-prefixed value
        .filter((supportStatement) => !supportStatement.prefix);

      if (supportBrowserAsArray.length === 0) {
        console.log(
          `No details found for browser ${browser} in compatibility data.`,
        );
        continue;
      }

      report[browser] = supportBrowserAsArray.map((compatibilityItem) => ({
        sinceVersion: getNumericVersion(
          compatibilityItem.version_added,
          browser,
        ),
        untilVersion:
          compatibilityItem.version_removed !== undefined
            ? getNumericVersion(compatibilityItem.version_removed, browser)
            : undefined,
        isPartialSupport: !!compatibilityItem.partial_implementation,
        isFlagged: !!compatibilityItem.flags?.length,
      }));
    }
  }

  return Object.keys(report).length > 0 ? report : null;
};
