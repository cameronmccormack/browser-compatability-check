import * as csstree from 'css-tree';
import {
  CssAtRule,
  CssFunction,
  CssProperty,
  CssPropertyContext,
  CssSelector,
  FormattedCss,
} from '../types/css-feature';
import { getUniqueObjectArray } from '../helpers/array-helper';
import {
  popContextFromStackIfRequired,
  pushContextToStackIfRequired,
} from './context-stack';

export const getFormattedCss = (parsedCss: csstree.CssNode): FormattedCss => {
  const properties: CssProperty[] = [];
  const selectors: CssSelector[] = [];
  const atRules: CssAtRule[] = [];
  const functions: CssFunction[] = [];

  const contextStack: CssPropertyContext[] = [];

  csstree.walk(parsedCss, {
    enter(node: csstree.CssNode) {
      switch (node.type) {
        case 'Declaration':
          properties.push({
            identifier: node.property,
            value: csstree.generate(node.value),
            type: 'property',
            context:
              // TODO: apply context for flex/grid items (this only handles the flex/grid container at present)
              node.property !== 'display' && contextStack.length > 0
                ? contextStack[contextStack.length - 1]
                : undefined,
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
      pushContextToStackIfRequired(node, contextStack);
    },
    leave(node: csstree.CssNode) {
      popContextFromStackIfRequired(node, contextStack);
    },
  });

  return {
    properties: getUniqueObjectArray(properties),
    selectors: getUniqueObjectArray(selectors),
    atRules: getUniqueObjectArray(atRules),
    functions: getUniqueObjectArray(functions),
  };
};
