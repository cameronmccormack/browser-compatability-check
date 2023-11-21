import { getIdFromFeature } from '../../src/helpers/feature-id-helper';
import { CssFeature } from '../../src/types/css-feature';

describe('getIdFromFeature works as expected', () => {
  test('works for property with context', () => {
    const cssFeature: CssFeature = {
      identifier: 'gap',
      value: '20px',
      context: 'flex_context',
      type: 'property',
    };
    expect(getIdFromFeature(cssFeature)).toEqual(
      'property:gap:20px:flex_context',
    );
  });

  test('works for property without context', () => {
    const cssFeature: CssFeature = {
      identifier: 'display',
      value: 'block',
      type: 'property',
    };
    expect(getIdFromFeature(cssFeature)).toEqual('property:display:block');
  });

  test('works for selector without context', () => {
    const cssFeature: CssFeature = {
      identifier: 'last-child',
      type: 'selector',
    };
    expect(getIdFromFeature(cssFeature)).toEqual('selector:last-child');
  });
});
