import {
  getFlattenedCssFeatures,
  getParsedCss,
} from '../../src/css-parser/css-parser';
import { CssFeature } from '../../src/types/css-feature';
import { ParsedCss } from '../../src/types/parsed-css';

describe('getFlattenedAttributes works as expected', () => {
  test('returns empty array for empty attributes', () => {
    const parsedCss: ParsedCss = {
      children: {},
      attributes: {},
    };
    const expectedResponse: CssFeature[] = [];

    expect(getFlattenedCssFeatures(parsedCss)).toEqual(expectedResponse);
  });

  test('removes duplicate attributes', () => {
    const attributes = { gap: '20px' };
    const parsedCss = {
      children: {
        child1: {
          children: {
            child2: {
              children: {},
              attributes,
            },
          },
          attributes,
        },
      },
      attributes: attributes,
    };
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
    const parsedCss = {
      children: {
        child1: {
          children: {
            child2: {
              children: {},
              attributes: {
                gap: '1px',
                'margin-top': '1px',
              },
            },
          },
          attributes: {
            gap: '2px',
            'margin-top': '2px',
          },
        },
      },
      attributes: {
        gap: '3px',
        'margin-top': '3px',
      },
    };
    const expectedResponse = [
      {
        identifier: 'gap',
        value: '3px',
        type: 'property',
      },
      {
        identifier: 'margin-top',
        value: '3px',
        type: 'property',
      },
      {
        identifier: 'gap',
        value: '2px',
        type: 'property',
      },
      {
        identifier: 'margin-top',
        value: '2px',
        type: 'property',
      },
      {
        identifier: 'gap',
        value: '1px',
        type: 'property',
      },
      {
        identifier: 'margin-top',
        value: '1px',
        type: 'property',
      },
    ];

    expect(getFlattenedCssFeatures(parsedCss)).toEqual(expectedResponse);
  });
});

describe('getParsedCss works as expected', () => {
  // TODO: add more tests for this once no longer using a library
  test('returns expected CSS', () => {
    expect(getParsedCss()).toEqual({
      attributes: {},
      children: {
        '#someid': { attributes: { color: 'green' }, children: {} },
        '.someclass': { attributes: { color: 'red' }, children: {} },
        '@media screen and (max-width: 600px)': {
          attributes: {},
          children: {
            body: {
              attributes: {
                'background-color': 'olive',
                'text-wrap': 'balance',
              },
              children: {},
            },
          },
        },
        '@media screen and (max-width: 992px)': {
          attributes: {},
          children: {
            body: { attributes: { 'background-color': 'blue' }, children: {} },
          },
        },
        body: {
          attributes: {
            'background-color': 'tan',
            'font-family': 'arial, sans-serif',
            'font-size': '14px',
            margin: '25px',
          },
          children: {},
        },
        h1: {
          attributes: {
            color: 'red',
            'font-size': '35px',
            'font-weight': 'normal',
            'margin-top': '5px',
          },
          children: {},
        },
        'li:last-child': {
          attributes: {
            border: '2px solid orange',
          },
          children: {},
        },
        'li ul': {
          attributes: {
            color: 'green',
          },
          children: {},
        },
      },
    });
  });
});
