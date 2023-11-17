import * as bcd from '@mdn/browser-compat-data';
import { ItemType } from '../types/mdn-types';
import { BROWSER_SLUGS } from './browser-slugs';
import { FeatureSupport } from '../types/browser-support-types';
import { CssFeature } from '../types/css-feature';
import { getIdFromFeature } from '../helpers/feature-id-helper';

const getItemType = (item: CssFeature): ItemType | null => {
  const featureId = getIdFromFeature(item);
  // TODO check the types returned here are all ok
  if (item.identifier in bcd.css.properties) {
    const itemWithContext =
      item.context && item.context in bcd.css.properties[item.identifier]
        ? bcd.css.properties[item.identifier][item.context]
        : bcd.css.properties[item.identifier];
    return { [featureId]: itemWithContext[item.value] ?? itemWithContext };
  } else if (item.identifier in bcd.css.properties['grid-template-columns']) {
    return bcd.css.properties['grid-template-columns'];
  } else if (item.identifier in bcd.css.selectors) {
    return bcd.css.selectors;
  } else if (item.identifier in bcd.css.types) {
    return bcd.css.types;
  } else if (item.identifier in bcd.css.types.color) {
    return bcd.css.types.color;
  } else if (item.identifier in bcd.css['at-rules']) {
    return bcd.css['at-rules'];
  }
  return null;
};

export const cssBrowserSupport = (
  feature: CssFeature,
): FeatureSupport | null => {
  const itemType = getItemType(feature);
  const featureId = getIdFromFeature(feature);

  const report = {} as FeatureSupport;

  if (itemType) {
    for (const browser of BROWSER_SLUGS) {
      const supportBrowser = itemType[featureId].__compat.support[browser];
      const supportBrowserIsArray = Array.isArray(supportBrowser);

      const versionAdded = supportBrowserIsArray
        ? supportBrowser[0].version_added
        : supportBrowser.version_added;
      const isFlagged = Boolean(
        supportBrowserIsArray ? supportBrowser[1].flags : supportBrowser.flags,
      );

      const sinceVersion = Number(versionAdded);
      if (isNaN(sinceVersion)) {
        console.log(
          `Browser version ${sinceVersion} is not a number for ${browser}`,
        );
      } else {
        report[browser] = {
          sinceVersion: Number(versionAdded),
          flagged: isFlagged,
        };
      }
    }
  }

  return Object.keys(report).length > 0 ? report : null;
};
