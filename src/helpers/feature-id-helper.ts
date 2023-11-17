import { CssFeature } from '../types/css-feature';

export const getIdFromFeature = (feature: CssFeature): string =>
  `${feature.identifier}:${feature.value}${
    feature.context ? `:${feature.context}` : ''
  }`;
