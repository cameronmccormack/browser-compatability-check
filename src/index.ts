import { isFeatureCompatible } from './browser-support/is-feature-compatible';
import browserConfig from './config/browser-config.json';
import {
  getFlattenedCssProperties,
  getFlattenedCssPseudoSelectors,
} from './css-parser/css-parser';
import * as csstree from 'css-tree';
import * as fs from 'fs';

export const main = (): void => {
  const file = fs.readFileSync('./src/css-parser/example.css', 'utf8');
  const parsedCss = csstree.parse(file);
  console.log(parsedCss);
  const flattenedProperties = getFlattenedCssProperties(parsedCss);
  const flattenedSelectors = getFlattenedCssPseudoSelectors(parsedCss);
  flattenedProperties.forEach((property) =>
    console.log(isFeatureCompatible(property, browserConfig)),
  );
  flattenedSelectors.forEach((selector) =>
    console.log(isFeatureCompatible(selector, browserConfig)),
  );

  console.log(
    isFeatureCompatible(
      { identifier: 'gap', value: '4px', type: 'property' },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      {
        identifier: 'gap',
        value: '4px',
        context: 'flex_context',
        type: 'property',
      },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      {
        identifier: 'gap',
        value: '4px',
        context: 'grid_context',
        type: 'property',
      },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      {
        identifier: 'aspect-ratio',
        value: '4',
        context: 'grid_context',
        type: 'property',
      },
      browserConfig,
    ),
  );

  console.log(
    isFeatureCompatible(
      { identifier: 'display', value: 'grid', type: 'property' },
      browserConfig,
    ),
  );
  console.log(
    isFeatureCompatible(
      { identifier: 'display', value: 'flex', type: 'property' },
      browserConfig,
    ),
  );
};

main();
