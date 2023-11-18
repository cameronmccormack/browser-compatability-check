import { Browser } from '../../src/types/browser';
import { CssFeature } from '../../src/types/css-feature';
import { isFeatureCompatible } from '../../src/browser-support/is-feature-compatible';
import * as cssBrowserSupportModule from '../../src/browser-support/css-browser-support';

const MODERN_CHROME_CONFIG = [
  {
    identifier: 'chrome',
    version: 122,
  },
];

const PRE_FLEX_GAP_CHROME_CONFIG = [
  {
    identifier: 'chrome',
    version: 80,
  },
];

const PRE_DISPLAY_GRID_CHROME_CONFIG = [
  {
    identifier: 'chrome',
    version: 28,
  },
];

type TestData = {
  identifier: string;
  value: string;
  context?: string;
  browserConfig: Browser[];
  expected: boolean;
};

const testCases: [string, TestData][] = [
  [
    'supported simple feature',
    {
      identifier: 'margin',
      value: '20px',
      browserConfig: MODERN_CHROME_CONFIG,
      expected: true,
    },
  ],
  [
    'supported feature in unsupported context',
    {
      identifier: 'gap',
      value: '20px',
      context: 'flex_context',
      browserConfig: PRE_FLEX_GAP_CHROME_CONFIG,
      expected: false,
    },
  ],
  [
    'supported feature in supported context (where unsupported context exists)',
    {
      identifier: 'gap',
      value: '20px',
      context: 'grid_context',
      browserConfig: PRE_FLEX_GAP_CHROME_CONFIG,
      expected: true,
    },
  ],
  [
    'supported feature with no context (where unsupported context exists)',
    {
      identifier: 'gap',
      value: '20px',
      browserConfig: PRE_FLEX_GAP_CHROME_CONFIG,
      expected: true,
    },
  ],
  [
    'supported feature with unknown context (where unsupported context exists)',
    {
      identifier: 'gap',
      value: '20px',
      context: 'not a real context',
      browserConfig: PRE_FLEX_GAP_CHROME_CONFIG,
      expected: true,
    },
  ],
  [
    'supported feature with unsupported value',
    {
      identifier: 'display',
      value: 'grid',
      browserConfig: PRE_DISPLAY_GRID_CHROME_CONFIG,
      expected: false,
    },
  ],
  [
    'supported feature with supported value (where unsupported value exists)',
    {
      identifier: 'display',
      value: 'inline-block',
      browserConfig: PRE_DISPLAY_GRID_CHROME_CONFIG,
      expected: true,
    },
  ],
  [
    'supported feature with unknown value (where unsupported value exists)',
    {
      identifier: 'display',
      value: 'unknown value',
      browserConfig: PRE_DISPLAY_GRID_CHROME_CONFIG,
      expected: true,
    },
  ],
];

test.each<[string, TestData]>(testCases)(
  'returns expected result for case: %s',
  (_, { identifier, value, context, browserConfig, expected }) => {
    const feature = {
      identifier,
      value,
      context,
      type: 'property',
    } as CssFeature;
    expect(isFeatureCompatible(feature, browserConfig)).toEqual(expected);
  },
);

test('throws an error for unknown CSS feature', () => {
  const feature = {
    identifier: 'not-a-real-feature',
    value: 'xyz',
    type: 'property',
  } as CssFeature;
  const expectedMessage =
    'Could not identify CSS feature: not-a-real-feature:xyz.';
  expect(() => isFeatureCompatible(feature, MODERN_CHROME_CONFIG)).toThrow(
    expectedMessage,
  );
});

test('throws an error for missing browser config', () => {
  const feature = {
    identifier: 'gap',
    value: '20px',
    type: 'property',
  } as CssFeature;
  const expectedMessage = 'Missing browser config.';
  expect(() => isFeatureCompatible(feature, [])).toThrow(expectedMessage);
});

test('throws an error if browser not found in support list for a CSS feature', () => {
  const feature = {
    identifier: 'gap',
    value: '20px',
    type: 'property',
  } as CssFeature;
  const browser = 'fake-browser';
  const browserConfig = [
    {
      identifier: browser,
      version: 100,
    },
  ];
  const expectedMessage =
    'Browser fake-browser not found in support list for gap:20px.';
  expect(() => isFeatureCompatible(feature, browserConfig)).toThrow(
    expectedMessage,
  );
});

test('throws an error if the minimum supported browser version is not a number', () => {
  const feature = {
    identifier: 'gap',
    value: '20px',
    type: 'property',
  } as CssFeature;
  const expectedMessage =
    'Minimum version for chrome for gap:20px cannot be converted to a number.';
  jest
    .spyOn(cssBrowserSupportModule, 'getCssBrowserSupport')
    .mockReturnValueOnce({
      chrome: {
        sinceVersion: 'not a number' as unknown as number,
        flagged: false,
      },
    });
  expect(() => isFeatureCompatible(feature, MODERN_CHROME_CONFIG)).toThrow(
    expectedMessage,
  );
});
