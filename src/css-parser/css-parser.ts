import * as csstree from 'css-tree';
import {
  CssAtRule,
  CssFunction,
  CssProperty,
  CssSelector,
  FormattedCss,
} from '../types/css-feature';
import { getUniqueObjectArray } from '../helpers/array-helper';

export const getFormattedCss = (parsedCss: csstree.CssNode): FormattedCss => {
  const properties: CssProperty[] = [];
  const selectors: CssSelector[] = [];
  const atRules: CssAtRule[] = [];
  const functions: CssFunction[] = [];

  csstree.walk(parsedCss, {
    enter(node: csstree.CssNode) {
      switch (node.type) {
        case 'Declaration':
          properties.push({
            identifier: node.property,
            value: csstree.generate(node.value),
            type: 'property',
          });
          break;
        case 'PseudoClassSelector':
        case 'PseudoElementSelector':
          selectors.push({
            identifier: node.name,
            type: 'selector',
          });
          break;
        case 'Atrule':
          atRules.push({
            identifier: node.name,
            type: 'at-rule',
          });
          break;
        case 'Function':
          functions.push({
            identifier: node.name,
            type: 'function',
          });
          break;
        default:
          // do nothing
          break;
      }
    },
  });

  return {
    properties: getUniqueObjectArray(properties),
    selectors: getUniqueObjectArray(selectors),
    atRules: getUniqueObjectArray(atRules),
    functions: getUniqueObjectArray(functions),
  };
};
