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

  const supportedFeatureIds: string[] = [];
  const unsupportedFeatureIds: string[] = [];
  const unknownFeatureIds: string[] = [];

  Object.values(formattedCss).forEach((featureArray) =>
    featureArray.forEach((feature) => {
      const compatibility = isFeatureCompatible(feature, browserConfig);
      switch (compatibility) {
        case 'compatible':
          supportedFeatureIds.push(getIdFromFeature(feature));
          break;
        case 'incompatible':
          unsupportedFeatureIds.push(getIdFromFeature(feature));
          break;
        case 'unknown':
          unknownFeatureIds.push(getIdFromFeature(feature));
      }
    }),
  );

  console.log('Supported:\n\n');
  supportedFeatureIds.map((i) => console.log(i));
  console.log('\n\nUnsupported:\n\n');
  unsupportedFeatureIds.map((i) => console.log(i));
  console.log('\n\nUnknown:\n\n');
  unknownFeatureIds.map((i) => console.log(i));
};

main();
