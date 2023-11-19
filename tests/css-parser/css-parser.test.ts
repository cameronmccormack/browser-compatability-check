import * as csstree from 'css-tree';
import { getFlattenedCssFeatures } from '../../src/css-parser/css-parser';
import { CssFeature } from '../../src/types/css-feature';

describe('getFlattenedAttributes works as expected', () => {
  test('returns empty array for empty attributes', () => {
    const parsedCss = csstree.parse('');
    const expectedResponse: CssFeature[] = [];

    expect(getFlattenedCssFeatures(parsedCss)).toEqual(expectedResponse);
  });

  test('removes duplicate attributes', () => {
    const css = `
    a {
        gap: 20px;
    }

    b {
        gap: 20px;
    }
    `;
    const parsedCss = csstree.parse(css);
    const expectedResponse = [
      {
        identifier: 'gap',
        value: '20px',
        type: 'property',
      },
    ];

    expect(getFlattenedCssFeatures(parsedCss)).toEqual(expectedResponse);
  });

  test('handles nested children with multiple attributes', () => {
    const css = `
    a {
        margin-top: 1px;
        gap: 1px;

        & b {
            margin-top: 2px;
            gap: 2px;

            & c {
                margin-top: 3px;
                gap: 3px;
            }
        }
    }
    `;
    const parsedCss = csstree.parse(css);
    const expectedResponse = [
      {
        identifier: 'margin-top',
        value: '1px',
        type: 'property',
      },
      {
        identifier: 'gap',
        value: '1px',
        type: 'property',
      },
      {
        identifier: 'margin-top',
        value: '2px',
        type: 'property',
      },
      {
        identifier: 'gap',
        value: '2px',
        type: 'property',
      },
      {
        identifier: 'margin-top',
        value: '3px',
        type: 'property',
      },
      {
        identifier: 'gap',
        value: '3px',
        type: 'property',
      },
    ];

    expect(getFlattenedCssFeatures(parsedCss)).toEqual(expectedResponse);
  });
});
