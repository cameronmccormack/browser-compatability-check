import { CssFeature, CssContext } from '../types/css-feature';

export const getIdFromFeature = (feature: CssFeature): string =>
  `${feature.identifier}:${feature.value}${
    feature.context ? `:${feature.context}` : ''
  }`;

export const getFeatureFromId = (id: string): CssFeature => {
  const splitId = id.split(':');
  const identifier = splitId[0];
  const value = splitId[1];
  const context = splitId[2] as CssContext | undefined;
  return { identifier, value, context };
};
