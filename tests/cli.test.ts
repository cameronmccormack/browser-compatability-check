import * as cssFinderModule from '../src/css-finder/get-all-css-files';
import * as cssParserModule from '../src/css-parser/css-parser';
import * as compatibilityReportModule from '../src/compatibility-report/get-compatibility-report';
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

type TestData = {
  report: CompatibilityReport;
  expectedExitCode: ExitCode;
  path?: string;
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
];

beforeEach(() => {
  jest
    .spyOn(cssFinderModule, 'getAllCssFiles')
    .mockReturnValueOnce([dummyCssFile]);
  jest
    .spyOn(cssParserModule, 'getFormattedCss')
    .mockReturnValueOnce(dummyFormattedCss);
});

test.each<[string, TestData]>(testCases)(
  'exits with expected status code for case: %s',
  (_, { report, expectedExitCode, path }) => {
    jest
      .spyOn(compatibilityReportModule, 'getCompatibilityReport')
      .mockReturnValueOnce(report);

    let exitCode: ExitCode | null = null;
    const exitWith = (code: ExitCode): ExitCode => {
      exitCode = code;
      return code;
    };

    runCli(exitWith, path);

    expect(exitCode).toEqual(expectedExitCode);
  },
);
