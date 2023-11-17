import { getCssBrowserSupport } from '../../src/browser-support/css-browser-support';
import { FeatureSupport } from '../../src/types/browser-support-types';
import { CssFeature } from '../../src/types/css-feature';
import {
  DISPLAY_GENERIC_COMPATIBILITY,
  DISPLAY_GRID_COMPATIBILITY,
  FLEX_GAP_COMPATIBILITY,
  FLEX_NO_CONTEXT_COMPATIBILITY as GAP_NO_CONTEXT_COMPATIBILITY,
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

type TestData = {
  identifier: string;
  value: string;
  context?: string;
  expected: FeatureSupport | null;
  mockBrowserCompatibilityData?: CompatData;
};

const testCases: [string, TestData][] = [
  [
    'unknown feature',
    {
      identifier: 'not-a-real-feature',
      value: 'fake-value',
      expected: null,
    },
  ],
  [
    'known feature with known context',
    {
      identifier: 'gap',
      value: '20px',
      context: 'flex_context',
      expected: FLEX_GAP_COMPATIBILITY,
    },
  ],
  [
    'known feature with unknown context',
    {
      identifier: 'gap',
      value: '20px',
      context: 'nonsense_fake_context',
      expected: GAP_NO_CONTEXT_COMPATIBILITY,
    },
  ],
  [
    'known feature with known value',
    {
      identifier: 'display',
      value: 'grid',
      expected: DISPLAY_GRID_COMPATIBILITY,
    },
  ],
  [
    'known feature with unknown value',
    {
      identifier: 'display',
      value: 'not-a-real-value',
      expected: DISPLAY_GENERIC_COMPATIBILITY,
    },
  ],
  [
    'invalid version added for a browser',
    {
      identifier: 'gap',
      value: '20px',
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
      expected: {
        chrome: GAP_NO_CONTEXT_COMPATIBILITY.chrome,
      },
      mockBrowserCompatibilityData: bcdDataWithOnlyChromeForGap,
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
    { identifier, value, context, expected, mockBrowserCompatibilityData },
  ) => {
    if (mockBrowserCompatibilityData) {
      jest
        .spyOn(bcdData, 'getCompatibilityData')
        .mockReturnValueOnce(mockBrowserCompatibilityData);
    }

    const feature = { identifier, value, context } as CssFeature;
    expect(getCssBrowserSupport(feature)).toEqual(expected);
  },
);
