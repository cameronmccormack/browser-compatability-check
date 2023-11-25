import * as csstree from 'css-tree';
import { CssPropertyContext } from '../types/css-feature';

export const pushContextToStackIfRequired = (
  currentNode: csstree.CssNode,
  contextStack: CssPropertyContext[],
): void => {
  if (currentNode.type === 'Block') {
    for (const node of currentNode.children) {
      if (node.type === 'Declaration' && node.property === 'display') {
        switch (csstree.generate(node.value)) {
          case 'grid':
            contextStack.push('grid_context');
            return;
          case 'flex':
            contextStack.push('flex_context');
            return;
        }
      }
    }
  }
};

export const popContextFromStackIfRequired = (
  currentNode: csstree.CssNode,
  contextStack: CssPropertyContext[],
): void => {
  if (
    currentNode.type === 'Block' &&
    currentNode.children.some((node) => {
      if (node.type !== 'Declaration') {
        return false;
      }

      const value = csstree.generate(node.value);
      return (
        node.property === 'display' && (value === 'grid' || value === 'flex')
      );
    })
  ) {
    contextStack.pop();
  }
};
