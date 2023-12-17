import { getCompatibilityReport } from '../../src/report-generators/get-compatibility-report';
import { DEFAULT_RULES } from '../../src/run-commands/default-rules';
import { FormattedCss } from '../../src/types/css-feature';
import {
  MODERN_CHROME_CONFIG,
  PRE_FLEX_GAP_CHROME_CONFIG,
} from '../test-data/browser-configs';
import { EXAMPLE_FILEPATH } from '../test-data/compatibility-reports';

test('creates expected compatibility report for empty formatted css', () => {
  const formattedCss = {
    properties: [],
    selectors: [],
    atRules: [],
    functions: [],
  };
  const emptyChromeReport = {
    filePath: EXAMPLE_FILEPATH,
    overallStatus: 'pass',
    browserSummaries: {
      chrome: {
        compatible: 0,
        flagged: 0,
        incompatible: 0,
        'partial-support': 0,
        unknown: 0,
      },
    },
    knownFeatures: {},
    unknownFeatures: [],
  };

  expect(
    getCompatibilityReport(
      formattedCss,
      MODERN_CHROME_CONFIG,
      EXAMPLE_FILEPATH,
      DEFAULT_RULES,
      [],
    ),
  ).toEqual(emptyChromeReport);
});

test('creates expected compatibility report for unsupported, partially supported and fully supported features', () => {
  const formattedCss: FormattedCss = {
    properties: [
      {
        identifier: 'gap',
        value: '20px',
        context: 'flex_context',
        type: 'property',
      },
      {
        identifier: 'gap',
        value: '20px',
        context: 'grid_context',
        type: 'property',
      },
      {
        identifier: 'outline',
        value: 'anything',
        type: 'property',
      },
    ],
    selectors: [],
    atRules: [],
    functions: [],
  };
  const expectedReport = {
    filePath: EXAMPLE_FILEPATH,
    overallStatus: 'fail',
    browserSummaries: {
      chrome: {
        compatible: 1,
        flagged: 0,
        incompatible: 1,
        'partial-support': 1,
        unknown: 0,
      },
    },
    knownFeatures: {
      'property:gap:20px:flex_context': {
        chrome: {
          compatibility: 'incompatible',
        },
      },
      'property:gap:20px:grid_context': {
        chrome: {
          compatibility: 'compatible',
        },
      },
      'property:outline:anything': {
        chrome: {
          compatibility: 'partial-support',
          notes:
            'Before Chrome 94, <code>outline</code> does not follow the shape of <code>border-radius</code>.',
        },
      },
    },
    unknownFeatures: [],
  };

  expect(
    getCompatibilityReport(
      formattedCss,
      PRE_FLEX_GAP_CHROME_CONFIG,
      EXAMPLE_FILEPATH,
      DEFAULT_RULES,
      [],
    ),
  ).toEqual(expectedReport);
});

test('creates expected compatibility report with warning for partially supported and fully supported features', () => {
  const formattedCss: FormattedCss = {
    properties: [
      {
        identifier: 'gap',
        value: '20px',
        context: 'grid_context',
        type: 'property',
      },
      {
        identifier: 'outline',
        value: 'anything',
        type: 'property',
      },
    ],
    selectors: [],
    atRules: [],
    functions: [],
  };
  const expectedReport = {
    filePath: EXAMPLE_FILEPATH,
    overallStatus: 'warn',
    browserSummaries: {
      chrome: {
        compatible: 1,
        flagged: 0,
        incompatible: 0,
        'partial-support': 1,
        unknown: 0,
      },
    },
    knownFeatures: {
      'property:gap:20px:grid_context': {
        chrome: {
          compatibility: 'compatible',
        },
      },
      'property:outline:anything': {
        chrome: {
          compatibility: 'partial-support',
          notes:
            'Before Chrome 94, <code>outline</code> does not follow the shape of <code>border-radius</code>.',
        },
      },
    },
    unknownFeatures: [],
  };

  expect(
    getCompatibilityReport(
      formattedCss,
      PRE_FLEX_GAP_CHROME_CONFIG,
      EXAMPLE_FILEPATH,
      DEFAULT_RULES,
      [],
    ),
  ).toEqual(expectedReport);
});

test('creates expected compatibility report for unknown feature', () => {
  const formattedCss: FormattedCss = {
    properties: [
      {
        identifier: 'not-a-real-feature',
        value: '20px',
        type: 'property',
      },
    ],
    selectors: [],
    atRules: [],
    functions: [],
  };
  const expectedReport = {
    filePath: EXAMPLE_FILEPATH,
    overallStatus: 'fail',
    browserSummaries: {
      chrome: {
        compatible: 0,
        flagged: 0,
        incompatible: 0,
        'partial-support': 0,
        unknown: 0,
      },
    },
    knownFeatures: {},
    unknownFeatures: ['property:not-a-real-feature:20px'],
  };

  expect(
    getCompatibilityReport(
      formattedCss,
      MODERN_CHROME_CONFIG,
      EXAMPLE_FILEPATH,
      DEFAULT_RULES,
      [],
    ),
  ).toEqual(expectedReport);
});

test('adds all types of css feature to compatibility report', () => {
  const formattedCss: FormattedCss = {
    properties: [
      {
        identifier: 'color',
        value: 'red',
        type: 'property',
      },
    ],
    selectors: [
      {
        identifier: 'last-child',
        type: 'selector',
      },
    ],
    atRules: [
      {
        identifier: 'charset',
        type: 'at-rule',
      },
    ],
    functions: [
      {
        identifier: 'calc',
        type: 'function',
      },
    ],
  };
  const expectedReport = {
    filePath: EXAMPLE_FILEPATH,
    overallStatus: 'pass',
    knownFeatures: {
      'property:color:red': { chrome: { compatibility: 'compatible' } },
      'selector:last-child': { chrome: { compatibility: 'compatible' } },
      'at-rule:charset': { chrome: { compatibility: 'compatible' } },
      'function:calc': { chrome: { compatibility: 'compatible' } },
    },
    unknownFeatures: [],
    browserSummaries: {
      chrome: {
        compatible: 4,
        'partial-support': 0,
        flagged: 0,
        incompatible: 0,
        unknown: 0,
      },
    },
  };

  expect(
    getCompatibilityReport(
      formattedCss,
      MODERN_CHROME_CONFIG,
      EXAMPLE_FILEPATH,
      DEFAULT_RULES,
      [],
    ),
  ).toEqual(expectedReport);
});

test('creates expected compatibility report with feature ignore, including overall status', () => {
  const formattedCss: FormattedCss = {
    properties: [
      {
        identifier: 'gap',
        value: '20px',
        context: 'flex_context',
        type: 'property',
      },
      {
        identifier: 'gap',
        value: '20px',
        context: 'grid_context',
        type: 'property',
      },
      {
        identifier: 'outline',
        value: 'anything',
        type: 'property',
      },
    ],
    selectors: [],
    atRules: [
      {
        identifier: 'media',
        type: 'at-rule',
      },
    ],
    functions: [],
  };
  const expectedReport = {
    filePath: EXAMPLE_FILEPATH,
    overallStatus: 'warn',
    browserSummaries: {
      chrome: {
        compatible: 1,
        flagged: 0,
        incompatible: 0,
        'partial-support': 1,
        unknown: 0,
      },
    },
    knownFeatures: {
      'property:gap:20px:grid_context': {
        chrome: {
          compatibility: 'compatible',
        },
      },
      'property:outline:anything': {
        chrome: {
          compatibility: 'partial-support',
          notes:
            'Before Chrome 94, <code>outline</code> does not follow the shape of <code>border-radius</code>.',
        },
      },
    },
    unknownFeatures: [],
  };

  expect(
    getCompatibilityReport(
      formattedCss,
      PRE_FLEX_GAP_CHROME_CONFIG,
      EXAMPLE_FILEPATH,
      DEFAULT_RULES,
      ['property:gap:20px:flex_context', 'at-rule'],
    ),
  ).toEqual(expectedReport);
});
