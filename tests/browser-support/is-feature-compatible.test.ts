import { Browser } from '../../src/types/browser';
import { CssFeature } from '../../src/types/css-feature';
import { isFeatureCompatible } from '../../src/browser-support/is-feature-compatible';

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

const FLAGGED_VIEW_TIMELINE_CONFIG = [
  {
    identifier: 'firefox',
    version: 114,
  },
];

const PARTIALLY_SUPPORTED_VIEW_TIMELINE_CONFIG = [
  {
    identifier: 'chrome',
    version: 115,
  },
];

const TOO_MODERN_EDGE_DOUBLE_TAP_ZOOM_CONFIG = [
  {
    identifier: 'edge',
    version: 100,
  },
];

type TestData = {
  identifier: string;
  value: string;
  context?: string;
  browserConfig?: Browser[];
  expected: string;
  expectedNotes?: string;
};

const testCases: [string, TestData][] = [
  [
    'supported simple feature',
    {
      identifier: 'margin',
      value: '20px',
      expected: 'compatible',
    },
  ],
  [
    'supported feature in unsupported context',
    {
      identifier: 'gap',
      value: '20px',
      context: 'flex_context',
      browserConfig: PRE_FLEX_GAP_CHROME_CONFIG,
      expected: 'incompatible',
    },
  ],
  [
    'supported feature in supported context (where unsupported context exists)',
    {
      identifier: 'gap',
      value: '20px',
      context: 'grid_context',
      browserConfig: PRE_FLEX_GAP_CHROME_CONFIG,
      expected: 'compatible',
    },
  ],
  [
    'supported feature with no context (where unsupported context exists)',
    {
      identifier: 'gap',
      value: '20px',
      browserConfig: PRE_FLEX_GAP_CHROME_CONFIG,
      expected: 'compatible',
    },
  ],
  [
    'supported feature with unknown context (where unsupported context exists)',
    {
      identifier: 'gap',
      value: '20px',
      context: 'not a real context',
      browserConfig: PRE_FLEX_GAP_CHROME_CONFIG,
      expected: 'compatible',
    },
  ],
  [
    'supported feature with unsupported value',
    {
      identifier: 'display',
      value: 'grid',
      browserConfig: PRE_DISPLAY_GRID_CHROME_CONFIG,
      expected: 'incompatible',
    },
  ],
  [
    'supported feature with supported value (where unsupported value exists)',
    {
      identifier: 'display',
      value: 'inline-block',
      browserConfig: PRE_DISPLAY_GRID_CHROME_CONFIG,
      expected: 'compatible',
    },
  ],
  [
    'supported feature with unknown value (where unsupported value exists)',
    {
      identifier: 'display',
      value: 'unknown value',
      browserConfig: PRE_DISPLAY_GRID_CHROME_CONFIG,
      expected: 'compatible',
    },
  ],
  [
    'browser not found in support list',
    {
      identifier: 'display',
      value: 'flex',
      browserConfig: [
        {
          identifier: 'not-real-browser',
          version: 20,
        },
      ],
      expected: 'unknown',
    },
  ],
  [
    'flagged feature',
    {
      identifier: 'view-timeline',
      value: 'any',
      browserConfig: FLAGGED_VIEW_TIMELINE_CONFIG,
      expected: 'flagged',
      expectedNotes:
        'Now supports the <code>x</code> and <code>y</code> values, and also the deprecated <code>horizontal</code> and <code>vertical</code> values.',
    },
  ],
  [
    'partially supported feature',
    {
      identifier: 'view-timeline',
      value: 'any',
      browserConfig: PARTIALLY_SUPPORTED_VIEW_TIMELINE_CONFIG,
      expected: 'partial-support',
      expectedNotes:
        '<code>view-timeline-attachment</code> not included in shorthand.',
    },
  ],
  [
    'no longer supported feature',
    {
      identifier: 'touch-action',
      value: 'double-tap-zoom',
      browserConfig: TOO_MODERN_EDGE_DOUBLE_TAP_ZOOM_CONFIG,
      expected: 'incompatible',
    },
  ],
];

test.each<[string, TestData]>(testCases)(
  'returns expected result for case: %s',
  (
    _,
    {
      identifier,
      value,
      context,
      browserConfig = MODERN_CHROME_CONFIG,
      expected,
      expectedNotes,
    },
  ) => {
    const feature = {
      identifier,
      value,
      context,
      type: 'property',
    } as CssFeature;
    expect(isFeatureCompatible(feature, browserConfig)).toEqual({
      [browserConfig[0].identifier]: {
        compatibility: expected,
        notes: expectedNotes,
      },
    });
  },
);

test('returns unknown-feature for unknown feature', () => {
  expect(
    isFeatureCompatible(
      { identifier: 'not-a-known-feature', value: '20px', type: 'property' },
      MODERN_CHROME_CONFIG,
    ),
  ).toEqual('unknown-feature');
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
