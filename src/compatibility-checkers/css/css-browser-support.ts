import {
  BrowserName,
  CompatStatement,
  Identifier,
  VersionValue,
} from '@mdn/browser-compat-data/types';
import { FeatureSupport } from '../../types/browser-support-types';
import {
  CssAtRule,
  CssFeature,
  CssFunction,
  CssProperty,
  CssSelector,
} from '../../types/css-feature';
import { getCompatibilityData } from '../source-data/bcd-data';
import { findCompatNode } from '../helpers/find-compat-node';

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
    item.context &&
    css.properties[item.identifier] &&
    item.context in css.properties[item.identifier]
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

const getNumericVersion = (rawVersion: VersionValue): number => {
  switch (typeof rawVersion) {
    case 'boolean':
      // MDN data uses true/false to indicate always supported/never supported
      return rawVersion ? 0 : Number.POSITIVE_INFINITY;
    case 'object':
      // Null case, used for unknown compatibility (treated as incompatible)
      return Number.POSITIVE_INFINITY;
    case 'string':
      return getNumericVersionFromString(rawVersion);
  }
};

const getNumericVersionFromString = (rawVersion: string): number => {
  if (rawVersion.length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  const numericVersion = Number(rawVersion.replace('≤', ''));

  // There are valid non-number strings for this value, e.g. the preview mode of Safari returns "preview".
  // Until a browser is released with a numeric version, a feature is considered experimental, and therefore
  // incompatible.
  return isNaN(numericVersion) ? Number.POSITIVE_INFINITY : numericVersion;
};

const getNoteString = (notes: string | string[]): string =>
  Array.isArray(notes) ? notes.join(' ') : notes;

const removeUndefinedValues = <T>(value: T | undefined): value is T =>
  value !== undefined;

export const getCssBrowserSupport = (
  feature: CssFeature,
  browsers: BrowserName[],
): FeatureSupport | null => {
  const compatibilityStatement = getCompatibilityStatement(feature);

  const report: FeatureSupport = {};

  if (compatibilityStatement) {
    for (const browser of browsers) {
      const supportBrowser = compatibilityStatement.support[browser];
      const supportBrowserAsArray = (
        Array.isArray(supportBrowser) ? supportBrowser : [supportBrowser]
      )
        .filter(removeUndefinedValues)
        // remove prefixed values - these are separate CSS features and lead to nonsensical
        // compatibility versions if included due to overlap with the non-prefixed value
        .filter((supportStatement) => !supportStatement.prefix);

      if (supportBrowserAsArray.length === 0) {
        continue;
      }

      report[browser] = supportBrowserAsArray.map((compatibilityItem) => ({
        sinceVersion: getNumericVersion(compatibilityItem.version_added),
        untilVersion:
          compatibilityItem.version_removed !== undefined
            ? getNumericVersion(compatibilityItem.version_removed)
            : undefined,
        isPartialSupport: !!compatibilityItem.partial_implementation,
        isFlagged: !!compatibilityItem.flags?.length,
        notes: compatibilityItem.notes
          ? getNoteString(compatibilityItem.notes)
          : undefined,
      }));
    }
    return report;
  } else {
    return null;
  }
};
