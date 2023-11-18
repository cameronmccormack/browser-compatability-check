import { getIdFromFeature } from '../../src/helpers/feature-id-helper';
import { CssFeature } from '../../src/types/css-feature';

describe('getIdFromFeature works as expected', () => {
  test('works for feature with context', () => {
    const cssFeature: CssFeature = {
      identifier: 'gap',
      value: '20px',
      context: 'flex_context',
      type: 'property',
    };
    expect(getIdFromFeature(cssFeature)).toEqual('gap:20px:flex_context');
  });

  test('works for feature without context', () => {
    const cssFeature: CssFeature = {
      identifier: 'display',
      value: 'block',
      type: 'property',
    };
    expect(getIdFromFeature(cssFeature)).toEqual('display:block');
  });
});
