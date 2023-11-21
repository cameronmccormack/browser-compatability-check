import * as csstree from 'css-tree';
import {
  CssAtRule,
  CssFunction,
  CssProperty,
  CssSelector,
} from '../types/css-feature';
import { getUniqueObjectArray } from '../helpers/array-helper';

export const getFlattenedCssProperties = (
  parsedCss: csstree.CssNode,
): CssProperty[] => {
  const features: CssProperty[] = [];
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

export const getFlattenedCssPseudoSelectors = (
  parsedCss: csstree.CssNode,
): CssSelector[] => {
  const features: CssSelector[] = [];
  csstree.walk(parsedCss, {
    enter(node: csstree.CssNode) {
      if (
        node.type === 'PseudoClassSelector' ||
        node.type === 'PseudoElementSelector'
      ) {
        features.push({
          identifier: node.name,
          type: 'selector',
        });
      }
    },
  });
  return getUniqueObjectArray(features);
};

export const getFlattenedCssAtRules = (
  parsedCss: csstree.CssNode,
): CssAtRule[] => {
  const features: CssAtRule[] = [];
  csstree.walk(parsedCss, {
    enter(node: csstree.CssNode) {
      if (node.type === 'Atrule') {
        features.push({
          identifier: node.name,
          type: 'at-rule',
        });
      }
    },
  });
  return getUniqueObjectArray(features);
};

export const getFlattenedCssFunctions = (
  parsedCss: csstree.CssNode,
): CssFunction[] => {
  const features: CssFunction[] = [];
  csstree.walk(parsedCss, {
    enter(node: csstree.CssNode) {
      if (node.type === 'Function') {
        features.push({
          identifier: node.name,
          type: 'function',
        });
      }
    },
  });
  return getUniqueObjectArray(features);
};
