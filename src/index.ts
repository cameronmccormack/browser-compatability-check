/* istanbul ignore file */

import { isFeatureCompatible } from './browser-support/is-feature-compatible';
import browserConfig from './config/browser-config.json';
import { getFormattedCss } from './css-parser/css-parser';
import * as csstree from 'css-tree';
import * as fs from 'fs';
import { getIdFromFeature } from './helpers/feature-id-helper';

export const main = (): void => {
  const file = fs.readFileSync('./src/css-parser/example.css', 'utf8');
  const parsedCss = csstree.parse(file);
  const formattedCss = getFormattedCss(parsedCss);

  const unknownFeatureIds: string[] = [];

  const supportedFeatureIds: string[] = [];
  const partiallySupportedFeatureIds: string[] = [];
  const flaggedFeatureIds: string[] = [];
  const unsupportedFeatureIds: string[] = [];
  const unknownCompatFeatureIds: string[] = [];

  Object.values(formattedCss).forEach((featureArray) =>
    featureArray.forEach((feature) => {
      const compatibility = isFeatureCompatible(feature, browserConfig);
      browserConfig.forEach((browser) => {
        if (compatibility === 'unknown-feature') {
          unknownFeatureIds.push(getIdFromFeature(feature));
        } else {
          switch (compatibility[browser.identifier].compatibility) {
            case 'compatible':
              supportedFeatureIds.push(
                `${browser.identifier} ${browser.version}: ${getIdFromFeature(
                  feature,
                )}`,
              );
              break;
            case 'partial-support':
              partiallySupportedFeatureIds.push(
                `${browser.identifier} ${browser.version}: ${getIdFromFeature(
                  feature,
                )}${
                  compatibility[browser.identifier].notes
                    ? `\n${compatibility[browser.identifier].notes}`
                    : ''
                }`,
              );
              break;
            case 'flagged':
              flaggedFeatureIds.push(
                `${browser.identifier} ${browser.version}: ${getIdFromFeature(
                  feature,
                )}${
                  compatibility[browser.identifier].notes
                    ? `\n${compatibility[browser.identifier].notes}`
                    : ''
                }`,
              );
              break;
            case 'incompatible':
              unsupportedFeatureIds.push(
                `${browser.identifier} ${browser.version}: ${getIdFromFeature(
                  feature,
                )}`,
              );
              break;
            case 'unknown':
              unknownCompatFeatureIds.push(
                `${browser.identifier} ${browser.version}: ${getIdFromFeature(
                  feature,
                )}`,
              );
          }
        }
      });
    }),
  );

  console.log('Supported:\n\n');
  supportedFeatureIds.map((i) => console.log(i));
  console.log('\n\nPartially Supported:\n\n');
  partiallySupportedFeatureIds.map((i) => console.log(i));
  console.log('\n\nFlagged:\n\n');
  flaggedFeatureIds.map((i) => console.log(i));
  console.log('\n\nUnsupported:\n\n');
  unsupportedFeatureIds.map((i) => console.log(i));
  console.log('\n\nUnknown:\n\n');
  unknownFeatureIds.map((i) => console.log(i));
};

main();
