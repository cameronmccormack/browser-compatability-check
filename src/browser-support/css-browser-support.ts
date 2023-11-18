import { BROWSER_SLUGS } from './browser-slugs';
import { FeatureSupport } from '../types/browser-support-types';
import { CssFeature } from '../types/css-feature';
import { getCompatibilityData } from './bcd-data';
import { CompatStatement, SupportBlock } from '@mdn/browser-compat-data/types';

const getCompatibilityStatement = (
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
  } else if (item.identifier in css.selectors) {
    return (
      css.selectors[item.identifier][item.value].__compat ??
      css.selectors[item.identifier].__compat ??
      null
    );
  } else if (item.identifier in css.types) {
    return (
      css.types[item.identifier][item.value].__compat ??
      css.types[item.identifier].__compat ??
      null
    );
  } else if (item.identifier in css.types.color) {
    return (
      css.types.color[item.identifier][item.value].__compat ??
      css.types.color[item.identifier].__compat ??
      null
    );
  } else if (item.identifier in css['at-rules']) {
    return (
      css['at-rules'][item.identifier][item.value].__compat ??
      css['at-rules'][item.identifier].__compat ??
      null
    );
  }
  return null;
};

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
