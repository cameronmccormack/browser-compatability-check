import { isFeatureCompatible } from './browser-support/is-feature-compatible';
import browserConfig from './config/browser-config.json';
import {
  getFlattenedCssAtRules,
  getFlattenedCssFunctions,
  getFlattenedCssProperties,
  getFlattenedCssPseudoSelectors,
} from './css-parser/css-parser';
import * as csstree from 'css-tree';
import * as fs from 'fs';

export const main = (): void => {
  const file = fs.readFileSync('./src/css-parser/example.css', 'utf8');
  const parsedCss = csstree.parse(file);
  const flattenedProperties = getFlattenedCssProperties(parsedCss);
  const flattenedSelectors = getFlattenedCssPseudoSelectors(parsedCss);
  const flattenedAtRules = getFlattenedCssAtRules(parsedCss);
  const flattenedFunctions = getFlattenedCssFunctions(parsedCss);
  console.log(flattenedFunctions);
  flattenedProperties.forEach((property) =>
    console.log(isFeatureCompatible(property, browserConfig)),
  );
  flattenedSelectors.forEach((selector) =>
    console.log(isFeatureCompatible(selector, browserConfig)),
  );
  flattenedAtRules.forEach((atRule) =>
    console.log(isFeatureCompatible(atRule, browserConfig)),
  );
  flattenedFunctions.forEach((fn) =>
    console.log(isFeatureCompatible(fn, browserConfig)),
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
  console.log(
    isFeatureCompatible(
      { identifier: 'display', value: 'flex', type: 'property' },
      browserConfig,
    ),
  );
};

main();
