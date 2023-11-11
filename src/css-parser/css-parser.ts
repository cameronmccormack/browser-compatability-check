import { toJSON } from 'cssjson';
import * as fs from 'fs';
import { ParsedCss } from '../types/parsed-css';
import { FlattenedAttributes } from '../types/flattened-attributes';
import { getUniqueObjectArray } from '../helpers/array-helper';

export const getParsedCss = (): ParsedCss => {
  const file = fs.readFileSync('./src/css-parser/example.css', 'utf8');
  return toJSON(file);
};

export const getFlattenedAttributes = (
  parsedCss: ParsedCss,
): FlattenedAttributes => {
  const attributes = [] as FlattenedAttributes;
  addAttributesToFlattenedArray(parsedCss, attributes);
  return getUniqueObjectArray(attributes);
};

const addAttributesToFlattenedArray = (
  parsedCss: ParsedCss,
  attributes: FlattenedAttributes,
): void => {
  const mappedAttributes = Object.keys(parsedCss.attributes).map((key) => ({
    key,
    value: parsedCss.attributes[key],
  }));
  attributes.push(...mappedAttributes);
  Object.values(parsedCss.children).forEach((child) =>
    addAttributesToFlattenedArray(child, attributes),
  );
};
