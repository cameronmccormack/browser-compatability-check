import { toJSON } from 'cssjson';
import * as fs from 'fs';
import { ParsedCss } from '../types/parsed-css';
import { getUniqueObjectArray } from '../helpers/array-helper';
import { CssFeature } from '../types/css-feature';

export const getParsedCss = (): ParsedCss => {
  const file = fs.readFileSync('./src/css-parser/example.css', 'utf8');
  return toJSON(file);
};

export const getFlattenedCssFeatures = (parsedCss: ParsedCss): CssFeature[] => {
  const attributes = [] as CssFeature[];
  addFeaturesToFlattenedArray(parsedCss, attributes);
  return getUniqueObjectArray(attributes);
};

const addFeaturesToFlattenedArray = (
  parsedCss: ParsedCss,
  attributes: CssFeature[],
): void => {
  const mappedAttributes = Object.keys(parsedCss.attributes).map(
    (identifier): CssFeature => ({
      identifier,
      value: parsedCss.attributes[identifier],
      context: undefined, // TODO: add some context here
      type: 'property',
    }),
  );
  attributes.push(...mappedAttributes);
  Object.values(parsedCss.children).forEach((child) =>
    addFeaturesToFlattenedArray(child, attributes),
  );
};
