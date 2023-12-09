import * as cssFinderModule from '../src/css-finder/get-all-css-files';
import * as cssParserModule from '../src/css-parser/css-parser';
import * as compatibilityReportModule from '../src/compatibility-report/get-compatibility-report';
import * as browserConfigModule from '../src/get-browser-config';
import {
  compatibleReport,
  flaggedCompatibilityReport,
  incompatibleReport,
  partiallyCompatibleReport,
  unknownCompatibilityReport,
  unknownFeatureReport,
} from './test-data/compatibility-reports';
import { runCli, ExitCode } from '../src/cli';
import { CompatibilityReport } from '../src/types/compatibility';
import { CssFile } from '../src/types/css-file';

type TestData = {
  report: CompatibilityReport;
  expectedExitCode: ExitCode;
  mockBrowserConfig?: unknown;
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
      mockBrowserConfig: [{ identifier: 'chrome', version: 'not-a-number' }],
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
      mockBrowserConfig: [
        { identifier: 'chrome', version: 1 },
        { identifier: 'chrome', version: 2 },
        { identifier: 'firefox', version: 1 },
        { identifier: 'firefox', version: 2 },
      ],
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
      mockBrowserConfig,
      cssFinderOverride,
    },
  ) => {
    jest
      .spyOn(compatibilityReportModule, 'getCompatibilityReport')
      .mockReturnValueOnce(report);
    jest
      .spyOn(cssFinderModule, 'getAllCssFiles')
      .mockReturnValueOnce(
        cssFinderOverride !== undefined ? cssFinderOverride : [dummyCssFile],
      );

    if (mockBrowserConfig) {
      jest
        .spyOn(browserConfigModule, 'getBrowserConfig')
        .mockReturnValueOnce(mockBrowserConfig);
    }

    let exitCode: ExitCode | null = null;
    let errorMessage: string | undefined = undefined;
    const exitWith = (code: ExitCode, message?: string): ExitCode => {
      exitCode = code;
      errorMessage = message;
      return code;
    };

    runCli(exitWith, path);

    expect(exitCode).toEqual(expectedExitCode);
    expect(errorMessage).toEqual(expectedErrorMessage);
  },
);
