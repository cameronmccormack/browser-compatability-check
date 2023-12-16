import * as cssFinderModule from '../src/globbers/css-globber';
import * as cssParserModule from '../src/tree-formatters/css/css-tree-formatter';
import * as compatibilityReportModule from '../src/report-generators/get-compatibility-report';
import * as kompatRcModule from '../src/run-commands/get-kompatrc';
import {
  compatibleReport,
  flaggedCompatibilityReport,
  flaggedCompatibilityReportWithOverallFailure,
  incompatibleReport,
  partiallyCompatibleReport,
  unknownCompatibilityReport,
  unknownFeatureReport,
} from './test-data/compatibility-reports';
import { runCli, ExitCode } from '../src/cli';
import { CompatibilityReport } from '../src/types/compatibility';
import { CssFile } from '../src/types/css-file';
import { MODERN_CHROME_CONFIG } from './test-data/browser-configs';
import { UnvalidatedKompatRc } from '../src/types/unvalidated-kompatrc';
import { Rules } from '../src/types/rules';
import { DEFAULT_RULES } from '../src/run-commands/default-rules';

type TestData = {
  report: CompatibilityReport;
  expectedExitCode: ExitCode;
  mockKompatRc?: UnvalidatedKompatRc | null;
  expectedRules?: Rules;
  expectedErrorMessage?: string;
  path?: string;
  cssFinderOverride?: CssFile[] | null;
};

const dummyCssFile = {
  path: 'stub-path',
  contents: '/* stub-contents */',
};

const dummyFormattedCss = {
  properties: [],
  selectors: [],
  atRules: [],
  functions: [],
};

const testCases: [string, TestData][] = [
  [
    'all features are compatible',
    {
      report: compatibleReport,
      expectedExitCode: 0,
    },
  ],
  [
    'partially compatible feature',
    {
      report: partiallyCompatibleReport,
      expectedExitCode: 0,
    },
  ],
  [
    'flagged compatibility feature',
    {
      report: flaggedCompatibilityReport,
      expectedExitCode: 0,
    },
  ],
  [
    'incompatible feature',
    {
      report: incompatibleReport,
      expectedExitCode: 1,
    },
  ],
  [
    'unknown compatibility feature',
    {
      report: unknownCompatibilityReport,
      expectedExitCode: 0,
    },
  ],
  [
    'unknown feature',
    {
      report: unknownFeatureReport,
      expectedExitCode: 1,
    },
  ],
  [
    'empty path given',
    {
      report: compatibleReport,
      expectedExitCode: 0,
      path: '',
    },
  ],
  [
    'non-empty path given',
    {
      report: compatibleReport,
      expectedExitCode: 0,
      path: 'this/could/be/anything',
    },
  ],
  [
    'invalid browser config given',
    {
      report: compatibleReport,
      expectedExitCode: 2,
      mockKompatRc: {
        browsers: [{ identifier: 'chrome', version: 'not-a-number' }],
      },
      expectedErrorMessage: `
Error: Malformed browser config: [
  {
    "code": "invalid_type",
    "expected": "number",
    "received": "string",
    "path": [
      0,
      "version"
    ],
    "message": "Expected number, received string"
  }
]
      `.trim(),
      path: 'this/could/be/anything',
    },
  ],
  [
    'duplicate browser config given',
    {
      report: compatibleReport,
      expectedExitCode: 2,
      mockKompatRc: {
        browsers: [
          { identifier: 'chrome', version: 1 },
          { identifier: 'chrome', version: 2 },
          { identifier: 'firefox', version: 1 },
          { identifier: 'firefox', version: 2 },
        ],
      },
      expectedErrorMessage:
        'Error: Duplicate browsers in config. Duplicates: chrome, firefox.',
      path: 'this/could/be/anything',
    },
  ],
  [
    'invalid css path given',
    {
      report: compatibleReport,
      expectedExitCode: 2,
      path: 'this/is/not/valid',
      cssFinderOverride: null,
      expectedErrorMessage: `Error: Invalid filepath: ${process.cwd()}/this/is/not/valid.`,
    },
  ],
  [
    'no css files found',
    {
      report: compatibleReport,
      expectedExitCode: 1,
      path: 'this/contains/no/css',
      cssFinderOverride: [],
      expectedErrorMessage: 'Error: No CSS files found.',
    },
  ],
  [
    'run command file not found',
    {
      report: compatibleReport,
      expectedExitCode: 2,
      mockKompatRc: null,
      expectedErrorMessage:
        'Error: could not find .kompatrc.yml or .kompatrc.yaml file.',
    },
  ],
  [
    'overridden compatibility',
    {
      report: flaggedCompatibilityReportWithOverallFailure,
      expectedExitCode: 1,
      expectedRules: {
        ...DEFAULT_RULES,
        flagged: 'fail',
      },
      mockKompatRc: {
        browsers: MODERN_CHROME_CONFIG,
        ruleOverrides: {
          flagged: 'fail',
        },
      },
    },
  ],
  [
    'unexpected value in rule overrides',
    {
      report: flaggedCompatibilityReportWithOverallFailure,
      expectedExitCode: 2,
      expectedErrorMessage: `
Error: Malformed rule overrides config: [
  {
    "received": "not a known value",
    "code": "invalid_enum_value",
    "options": [
      "pass",
      "warn",
      "fail"
    ],
    "path": [
      "flagged"
    ],
    "message": "Invalid enum value. Expected 'pass' | 'warn' | 'fail', received 'not a known value'"
  }
]
      `.trim(),
      mockKompatRc: {
        browsers: MODERN_CHROME_CONFIG,
        ruleOverrides: {
          flagged: 'not a known value',
        },
      },
    },
  ],
];

beforeEach(() => {
  jest
    .spyOn(cssParserModule, 'getFormattedCss')
    .mockReturnValueOnce(dummyFormattedCss);
});

afterEach(() => jest.restoreAllMocks());

test.each<[string, TestData]>(testCases)(
  'exits with expected status code and message for case: %s',
  (
    _,
    {
      report,
      expectedExitCode,
      expectedErrorMessage,
      path,
      mockKompatRc,
      cssFinderOverride,
      expectedRules,
    },
  ) => {
    const getCompatibilityReportSpy = jest
      .spyOn(compatibilityReportModule, 'getCompatibilityReport')
      .mockReturnValueOnce(report);
    jest
      .spyOn(cssFinderModule, 'getAllCssFiles')
      .mockReturnValueOnce(
        cssFinderOverride !== undefined ? cssFinderOverride : [dummyCssFile],
      );
    jest
      .spyOn(kompatRcModule, 'getKompatRc')
      .mockReturnValueOnce(
        mockKompatRc === null
          ? null
          : mockKompatRc ?? { browsers: MODERN_CHROME_CONFIG },
      );

    let exitCode: ExitCode | null = null;
    let errorMessage: string | undefined = undefined;
    const exitWith = (code: ExitCode, message?: string): ExitCode => {
      exitCode = code;
      errorMessage = message;
      return code;
    };

    runCli(exitWith, path);

    if (expectedRules) {
      expect(getCompatibilityReportSpy).toHaveBeenCalledWith(
        dummyFormattedCss,
        mockKompatRc?.browsers ?? MODERN_CHROME_CONFIG,
        dummyCssFile.path,
        expectedRules,
      );
    }
    expect(exitCode).toEqual(expectedExitCode);
    expect(errorMessage).toEqual(expectedErrorMessage);
  },
);
