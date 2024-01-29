import { produce } from 'immer';
import bcd, { BrowserName, CompatData } from '@mdn/browser-compat-data';
import { getCssBrowserSupport } from '../../../src/compatibility-checkers/css/css-browser-support';
import { FeatureSupport } from '../../../src/types/browser-support-types';
import { CssFeature } from '../../../src/types/css-feature';
import {
  CALC_FUNCTION_COMPATIBILITY,
  DISPLAY_GENERIC_COMPATIBILITY,
  DISPLAY_GRID_COMPATIBILITY,
  FLEX_GAP_COMPATIBILITY,
  GAP_NO_CONTEXT_COMPATIBILITY,
  LAST_CHILD_COMPATIBILITY,
  MEDIA_AT_RULE_COMPATIBILITY,
  RGB_FUNCTION_COMPATIBILITY,
  VAR_FUNCTION_COMPATIBILITY,
} from '../../test-data/browser-compatibility-data';
import * as bcdData from '../../../src/compatibility-checkers/source-data/bcd-data';
const BROWSER_SLUGS: BrowserName[] = [
  'chrome',
  'chrome_android',
  'edge',
  'firefox',
  'firefox_android',
  'ie',
  'opera',
  'safari',
  'safari_ios',
  'samsunginternet_android',
];

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

const bcdDataWithFirefoxFlagForGap = produce(bcd, (draft) => {
  draft.css.properties.gap.__compat!.support.firefox = {
    version_added: '999',
    flags: [
      {
        type: 'preference',
        name: 'layout.css.content-visibility.enabled',
        value_to_set: 'true',
      },
    ],
  };
});

const bcdDataWithFirefoxPartialSupportForGap = produce(bcd, (draft) => {
  draft.css.properties.gap.__compat!.support.firefox = {
    version_added: '999',
    partial_implementation: true,
  };
});

const bcdDataWithFirefoxVersionRemovedForGap = produce(bcd, (draft) => {
  draft.css.properties.gap.__compat!.support.firefox = {
    version_added: '999',
    version_removed: '1000',
  };
});

type TestData = {
  identifier: string;
  value?: string;
  context?: string;
  type: string;
  expected?: FeatureSupport | null;
  expectedErrorMessage?: string;
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
      expectedErrorMessage:
        'Browser version not a number could not be converted to a number for chrome',
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
      expected: CALC_FUNCTION_COMPATIBILITY,
    },
  ],
  [
    'color function with known identifier',
    {
      identifier: 'rgb',
      type: 'function',
      expected: RGB_FUNCTION_COMPATIBILITY,
    },
  ],
  [
    'custom property function with known identifier',
    {
      identifier: 'var',
      type: 'function',
      expected: VAR_FUNCTION_COMPATIBILITY,
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
        chrome: [
          {
            sinceVersion: 123.456,
            isFlagged: false,
            isPartialSupport: false,
          },
        ],
      },
      mockBrowserCompatibilityData: bcdDataWithLessThanValueForGap,
    },
  ],
  [
    'prefixed MDN items removed from formatted support compatibility',
    {
      identifier: 'display',
      value: 'grid',
      type: 'property',
      expected: DISPLAY_GRID_COMPATIBILITY,
    },
  ],
  [
    'flagged feature',
    {
      identifier: 'gap',
      value: '20px',
      type: 'property',
      expected: produce(
        GAP_NO_CONTEXT_COMPATIBILITY,
        (draft: FeatureSupport) => {
          draft.firefox = [
            {
              sinceVersion: 999,
              isFlagged: true,
              isPartialSupport: false,
            },
          ];
        },
      ),
      mockBrowserCompatibilityData: bcdDataWithFirefoxFlagForGap,
    },
  ],
  [
    'partially supported feature',
    {
      identifier: 'gap',
      value: '20px',
      type: 'property',
      expected: produce(
        GAP_NO_CONTEXT_COMPATIBILITY,
        (draft: FeatureSupport) => {
          draft.firefox = [
            {
              sinceVersion: 999,
              isFlagged: false,
              isPartialSupport: true,
            },
          ];
        },
      ),
      mockBrowserCompatibilityData: bcdDataWithFirefoxPartialSupportForGap,
    },
  ],
  [
    'added then removed feature',
    {
      identifier: 'gap',
      value: '20px',
      type: 'property',
      expected: produce(
        GAP_NO_CONTEXT_COMPATIBILITY,
        (draft: FeatureSupport) => {
          draft.firefox = [
            {
              sinceVersion: 999,
              untilVersion: 1000,
              isFlagged: false,
              isPartialSupport: false,
            },
          ];
        },
      ),
      mockBrowserCompatibilityData: bcdDataWithFirefoxVersionRemovedForGap,
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
      expectedErrorMessage,
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

    if (expectedErrorMessage) {
      expect(() => getCssBrowserSupport(feature, BROWSER_SLUGS)).toThrow(
        expectedErrorMessage,
      );
    } else {
      expect(getCssBrowserSupport(feature, BROWSER_SLUGS)).toEqual(expected);
    }
  },
);
