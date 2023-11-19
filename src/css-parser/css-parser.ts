import * as csstree from 'css-tree';
import { CssFeature } from '../types/css-feature';
import { getUniqueObjectArray } from '../helpers/array-helper';

export const getFlattenedCssFeatures = (
  parsedCss: csstree.CssNode,
): CssFeature[] => {
  const features: CssFeature[] = [];
  csstree.walk(parsedCss, {
    enter(node: csstree.CssNode) {
      if (node.type === 'Declaration') {
        features.push({
          identifier: node.property,
          value: csstree.generate(node.value),
          type: 'property',
        });
      }
    },
  });
  return getUniqueObjectArray(features);
};
