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
  Object.values(formattedCss).forEach((featureArray) =>
    featureArray.forEach((feature) => {
      console.log(
        `${getIdFromFeature(feature)} - ${isFeatureCompatible(
          feature,
          browserConfig,
        )}`,
      );
    }),
  );
};

main();
