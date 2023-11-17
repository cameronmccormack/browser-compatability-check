import { BROWSER_SLUGS } from './browser-slugs';
import { FeatureSupport } from '../types/browser-support-types';
import { CssFeature } from '../types/css-feature';
import { getCompatibilityData } from './bcd-data';
import { CompatStatement, SupportBlock } from '@mdn/browser-compat-data/types';

const getCompatabilityStatement = (
  item: CssFeature,
): CompatStatement | null => {
  const { css } = getCompatibilityData();
  if (item.identifier in css.properties) {
    const itemWithContext =
      item.context && item.context in css.properties[item.identifier]
        ? css.properties[item.identifier][item.context]
        : css.properties[item.identifier];
    return (
      itemWithContext[item.value]?.__compat ?? itemWithContext?.__compat ?? null
    );
  } else if (item.identifier in css.properties['grid-template-columns']) {
    return css.properties['grid-template-columns']?.__compat ?? null;
  } else if (item.identifier in css.selectors) {
    return css.selectors?.__compat ?? null;
  } else if (item.identifier in css.types) {
    return css.types?.__compat ?? null;
  } else if (item.identifier in css.types.color) {
    return css.types.color?.__compat ?? null;
  } else if (item.identifier in css['at-rules']) {
    return css['at-rules']?.__compat ?? null;
  }
  return null;
};

export const getCssBrowserSupport = (
  feature: CssFeature,
): FeatureSupport | null => {
  const compatabilityStatement = getCompatabilityStatement(feature);

  const report = {} as FeatureSupport;

  if (compatabilityStatement) {
    for (const browser of BROWSER_SLUGS) {
      const supportBrowser =
        compatabilityStatement.support[browser as keyof SupportBlock];
      const supportBrowserIsArray = Array.isArray(supportBrowser);

      const versionAdded = supportBrowserIsArray
        ? supportBrowser[0].version_added
        : supportBrowser?.version_added;
      const isFlagged = Boolean(
        supportBrowserIsArray ? supportBrowser[1].flags : supportBrowser?.flags,
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
