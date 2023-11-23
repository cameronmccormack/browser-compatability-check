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
import { CompatStatement, Identifier } from '@mdn/browser-compat-data/types';
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

export const getCssBrowserSupport = (
  feature: CssFeature,
): FeatureSupport | null => {
  const compatibilityStatement = getCompatibilityStatement(feature);

  const report = {} as FeatureSupport;

  if (compatibilityStatement) {
    for (const browser of BROWSER_SLUGS) {
      const supportBrowser = compatibilityStatement.support[browser];
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

      // TODO: work out when this is boolean
      const rawVersionAdded = supportBrowserIsArray
        ? supportBrowser[0].version_added
        : supportBrowser.version_added;
      const isFlagged = Boolean(
        supportBrowserIsArray
          ? supportBrowser[1].flags?.length // todo why is this [1]?
          : supportBrowser?.flags?.length,
      );

      const knownVersion =
        typeof rawVersionAdded === 'string'
          ? rawVersionAdded.replace('≤', '')
          : rawVersionAdded;

      const sinceVersion = knownVersion
        ? Number(knownVersion)
        : Number.POSITIVE_INFINITY;
      if (isNaN(sinceVersion)) {
        console.log(
          `Browser version ${knownVersion} is not a number for ${browser}`,
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
