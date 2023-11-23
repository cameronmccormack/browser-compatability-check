import { getCssBrowserSupport } from '../../src/browser-support/css-browser-support';
import { FeatureSupport } from '../../src/types/browser-support-types';
import { CssFeature } from '../../src/types/css-feature';
import {
  CALC_FUNCTION_COMPATABILITY,
  DISPLAY_GENERIC_COMPATIBILITY,
  DISPLAY_GRID_COMPATIBILITY,
  FLEX_GAP_COMPATIBILITY,
  FLEX_NO_CONTEXT_COMPATIBILITY as GAP_NO_CONTEXT_COMPATIBILITY,
  LAST_CHILD_COMPATIBILITY,
  MEDIA_AT_RULE_COMPATIBILITY,
  RGB_FUNCTION_COMPATABILITY,
  VAR_FUNCTION_COMPATABILITY,
} from '../test-data/browser-compatability-data';
import { produce } from 'immer';
import bcd, { CompatData } from '@mdn/browser-compat-data';
import * as bcdData from '../../src/browser-support/bcd-data';

const bcdDataWithNaNChromeVersionForGap = produce(bcd, (draft) => {
  draft.css.properties.gap.__compat!.support.chrome = {
    version_added: 'not a number',
    flags: [],
  };
});

const bcdDataWithEmptyArrayChromeForGap = produce(bcd, (draft) => {
  draft.css.properties.gap.__compat!.support.chrome = [];
});

const bcdDataWithOnlyChromeForGap = produce(bcd, (draft) => {
  draft.css.properties.gap.__compat!.support = {
    chrome: draft.css.properties.gap.__compat!.support.chrome,
  };
});

const bcdDataWithLessThanValueForGap = produce(bcd, (draft) => {
  draft.css.properties.gap.__compat!.support = {
    chrome: {
      version_added: '≤123.456',
      flags: [],
    },
  };
});

type TestData = {
  identifier: string;
  value?: string;
  context?: string;
  type: string;
  expected: FeatureSupport | null;
  mockBrowserCompatibilityData?: CompatData;
};

const testCases: [string, TestData][] = [
  [
    'unknown property',
    {
      identifier: 'not-a-real-property',
      value: 'fake-value',
      type: 'property',
      expected: null,
    },
  ],
  [
    'known property with known context',
    {
      identifier: 'gap',
      value: '20px',
      context: 'flex_context',
      type: 'property',
      expected: FLEX_GAP_COMPATIBILITY,
    },
  ],
  [
    'known property with unknown context',
    {
      identifier: 'gap',
      value: '20px',
      context: 'nonsense_fake_context',
      type: 'property',
      expected: GAP_NO_CONTEXT_COMPATIBILITY,
    },
  ],
  [
    'known property with known value',
    {
      identifier: 'display',
      value: 'grid',
      type: 'property',
      expected: DISPLAY_GRID_COMPATIBILITY,
    },
  ],
  [
    'known property with unknown value',
    {
      identifier: 'display',
      value: 'not-a-real-value',
      type: 'property',
      expected: DISPLAY_GENERIC_COMPATIBILITY,
    },
  ],
  [
    'invalid version added for a browser',
    {
      identifier: 'gap',
      value: '20px',
      type: 'property',
      expected: produce(
        GAP_NO_CONTEXT_COMPATIBILITY,
        (draft: FeatureSupport) => {
          delete draft.chrome;
        },
      ),
      mockBrowserCompatibilityData: bcdDataWithNaNChromeVersionForGap,
    },
  ],
  [
    'empty array for a browser',
    {
      identifier: 'gap',
      value: '20px',
      type: 'property',
      expected: produce(
        GAP_NO_CONTEXT_COMPATIBILITY,
        (draft: FeatureSupport) => {
          delete draft.chrome;
        },
      ),
      mockBrowserCompatibilityData: bcdDataWithEmptyArrayChromeForGap,
    },
  ],
  [
    'missing browsers from data',
    {
      identifier: 'gap',
      value: '20px',
      type: 'property',
      expected: {
        chrome: GAP_NO_CONTEXT_COMPATIBILITY.chrome,
      },
      mockBrowserCompatibilityData: bcdDataWithOnlyChromeForGap,
    },
  ],
  [
    'unknown type',
    {
      identifier: 'gap',
      value: '20px',
      type: 'not-a-real-type',
      expected: null,
    },
  ],
  [
    'selector with known identifier',
    {
      identifier: 'last-child',
      type: 'selector',
      expected: LAST_CHILD_COMPATIBILITY,
    },
  ],
  [
    'selector with unknown identifier',
    {
      identifier: 'unknown id',
      type: 'selector',
      expected: null,
    },
  ],
  [
    'at rule with known identifier',
    {
      identifier: 'media',
      type: 'at-rule',
      expected: MEDIA_AT_RULE_COMPATIBILITY,
    },
  ],
  [
    'at rule with unknown identifier',
    {
      identifier: 'unknown id',
      type: 'at-rule',
      expected: null,
    },
  ],
  [
    'function with known identifier',
    {
      identifier: 'calc',
      type: 'function',
      expected: CALC_FUNCTION_COMPATABILITY,
    },
  ],
  [
    'color function with known identifier',
    {
      identifier: 'rgb',
      type: 'function',
      expected: RGB_FUNCTION_COMPATABILITY,
    },
  ],
  [
    'custom property function with known identifier',
    {
      identifier: 'var',
      type: 'function',
      expected: VAR_FUNCTION_COMPATABILITY,
    },
  ],
  [
    'function with unknown identifier',
    {
      identifier: 'not known',
      type: 'function',
      expected: null,
    },
  ],
  [
    '"less than" browser compatibility in data',
    {
      identifier: 'gap',
      value: '20px',
      type: 'property',
      expected: {
        chrome: {
          sinceVersion: 123.456,
          flagged: false,
        },
      },
      mockBrowserCompatibilityData: bcdDataWithLessThanValueForGap,
    },
  ],
];

afterEach(() => {
  jest.clearAllMocks();
});

test.each<[string, TestData]>(testCases)(
  'returns expected result for case: %s',
  (
    _,
    {
      identifier,
      value,
      context,
      expected,
      type,
      mockBrowserCompatibilityData,
    },
  ) => {
    if (mockBrowserCompatibilityData) {
      jest
        .spyOn(bcdData, 'getCompatibilityData')
        .mockReturnValueOnce(mockBrowserCompatibilityData);
    }

    const feature = { identifier, value, context, type } as CssFeature;
    expect(getCssBrowserSupport(feature)).toEqual(expected);
  },
);
