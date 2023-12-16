import * as csstree from 'css-tree';
import { getFormattedCss } from '../../../src/tree-formatters/css/css-tree-formatter';

const EMPTY_FORMATTED_CSS = {
  properties: [],
  functions: [],
  atRules: [],
  selectors: [],
};

describe('getFormattedCss works as expected', () => {
  test('returns empty array for empty attributes', () => {
    const parsedCss = csstree.parse('');
    const expectedResponse = EMPTY_FORMATTED_CSS;

    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test('formats a property', () => {
    const css = 'a { gap: 20px ; }';
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      ...EMPTY_FORMATTED_CSS,
      properties: [
        {
          identifier: 'gap',
          value: '20px',
          type: 'property',
        },
      ],
    };
    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test.each(['grid', 'flex'])('applies %s context', (display) => {
    const css = `
      a {
        display: ${display};
        gap: 20px;
      }
    `;
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      ...EMPTY_FORMATTED_CSS,
      properties: [
        {
          identifier: 'display',
          value: display,
          type: 'property',
        },
        {
          identifier: 'gap',
          value: '20px',
          type: 'property',
          context: `${display}_context`,
        },
      ],
    };
    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test('formats a function', () => {
    const css = 'a { gap: calc(20px + 10px); }';
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      ...EMPTY_FORMATTED_CSS,
      properties: [
        {
          identifier: 'gap',
          value: 'calc(20px + 10px)',
          type: 'property',
        },
      ],
      functions: [
        {
          identifier: 'calc',
          type: 'function',
        },
      ],
    };
    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test('formats an at rule', () => {
    const css = '@charset "utf8"';
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      ...EMPTY_FORMATTED_CSS,
      atRules: [
        {
          identifier: 'charset',
          type: 'at-rule',
        },
      ],
    };
    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test('formats a pseudo-class selector', () => {
    const css = 'a:hover {}';
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      ...EMPTY_FORMATTED_CSS,
      selectors: [
        {
          identifier: 'hover',
          type: 'selector',
        },
      ],
    };
    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test('formats a pseudo-element selector', () => {
    const css = 'a::first-child {}';
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      ...EMPTY_FORMATTED_CSS,
      selectors: [
        {
          identifier: 'first-child',
          type: 'selector',
        },
      ],
    };
    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test('removes duplicate attributes', () => {
    const css = `
    a:hover {
        gap: 20px;
    }

    b:hover {
        gap: 20px;
    }

    a::first-line {
      gap: 20px;
    }

    b::first-line {
      gap: 20px;
    }

    h1 {
      gap: var(--example1)
    }

    h2 {
      gap: var(--example2)
    }

    @charset "utf8";
    @charset "utf8";
    `;
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      properties: [
        {
          identifier: 'gap',
          value: '20px',
          type: 'property',
        },
        {
          identifier: 'gap',
          value: 'var(--example1)',
          type: 'property',
        },
        {
          identifier: 'gap',
          value: 'var(--example2)',
          type: 'property',
        },
      ],
      functions: [
        {
          identifier: 'var',
          type: 'function',
        },
      ],
      atRules: [
        {
          identifier: 'charset',
          type: 'at-rule',
        },
      ],
      selectors: [
        {
          identifier: 'hover',
          type: 'selector',
        },
        {
          identifier: 'first-line',
          type: 'selector',
        },
      ],
    };

    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
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
    const expectedProperties = [
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
    const expectedResponse = {
      properties: expectedProperties,
      functions: [],
      atRules: [],
      selectors: [],
    };

    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test('splits space-separated values into separate elements', () => {
    const css = 'a { grid-template-columns: min-content auto 20px 1fr }';
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      ...EMPTY_FORMATTED_CSS,
      properties: [
        {
          identifier: 'grid-template-columns',
          value: 'min-content auto 20px 1fr',
          type: 'property',
        },
        {
          identifier: 'grid-template-columns',
          value: 'min-content',
          type: 'property',
        },
        {
          identifier: 'grid-template-columns',
          value: 'auto',
          type: 'property',
        },
        {
          identifier: 'grid-template-columns',
          value: '20px',
          type: 'property',
        },
        {
          identifier: 'grid-template-columns',
          value: '1fr',
          type: 'property',
        },
      ],
    };
    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });

  test('splits comma-separated values into separate elements', () => {
    const css = 'a { font-family: arial, sans-serif; }';
    const parsedCss = csstree.parse(css);
    const expectedResponse = {
      ...EMPTY_FORMATTED_CSS,
      properties: [
        {
          identifier: 'font-family',
          value: 'arial,sans-serif',
          type: 'property',
        },
        {
          identifier: 'font-family',
          value: 'arial',
          type: 'property',
        },
        {
          identifier: 'font-family',
          value: 'sans-serif',
          type: 'property',
        },
      ],
    };
    expect(getFormattedCss(parsedCss)).toEqual(expectedResponse);
  });
});
