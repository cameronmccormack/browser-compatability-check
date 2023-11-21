import { CssFeature } from '../types/css-feature';

export const getIdFromFeature = (feature: CssFeature): string => {
  switch (feature.type) {
    case 'property':
      return `${feature.type}:${feature.identifier}:${feature.value}${
        feature.context ? `:${feature.context}` : ''
      }`;
    case 'selector':
    case 'at-rule':
      return `${feature.type}:${feature.identifier}`;
  }
};
