import * as cssFinderModule from '../src/globbers/css-globber';
import * as cssParserModule from '../src/tree-formatters/css/css-tree-formatter';
import * as compatibilityReportModule from '../src/report-generators/get-compatibility-report';
import * as kompatRcModule from '../src/run-commands/get-kompatrc';
import * as filepathHelperModule from '../src/helpers/filepath-helper';
import { runCli, ExitCode } from '../src/cli';
import { CompatibilityReport } from '../src/types/compatibility';
import { CssFile } from '../src/types/css-file';
import { UnvalidatedKompatRc } from '../src/types/kompatrc';
import { Rules } from '../src/types/rules';
import { DEFAULT_RULES } from '../src/run-commands/default-rules';
import { ClientError } from '../src/errors/client-error';
import { MODERN_CHROME_CONFIG } from './test-data/browser-configs';
import {
  compatibleReport,
  flaggedCompatibilityReport,
  flaggedCompatibilityReportWithOverallFailure,
  incompatibleReport,
  partiallyCompatibleReport,
  unknownCompatibilityReport,
  unknownFeatureReport,
} from './test-data/compatibility-reports';

type TestData = {
  report: CompatibilityReport;
  expectedExitCode: ExitCode;
  mockKompatRc?: UnvalidatedKompatRc | null;
  expectedRules?: Rules;
  expectedErrorMessage?: string;
  expectedCssParsingErrors?: string[];
  path?: string;
  cssFinderOverride?: CssFile[] | { errorMessage: string };
};

const invalidCssPath = 'this/is/not/valid';

const dummyCssFile: CssFile = {
  path: 'stub-path',
  contents: '/* stub-contents */',
  type: 'css',
};

const dummyFormattedCss = {
  properties: [],
  selectors: [],
  atRules: [],
  functions: [],
};

afterEach(() => jest.restoreAllMocks());

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
      path: invalidCssPath,
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
    'malformed css found in strict mode',
    {
      report: compatibleReport,
      expectedExitCode: 1,
      path: 'this/contains/bad/css',
      mockKompatRc: {
        browsers: MODERN_CHROME_CONFIG,
        parserOptions: {
          strict: true,
        },
      },
      cssFinderOverride: [
        {
          path: 'this/contains/bad/css/malformed.css',
          type: 'css',
          contents: '.a { ::: invalid css ::: }',
        },
      ],
      expectedErrorMessage: `
Error: Error in this/contains/bad/css/malformed.css:

Parse error: Identifier is expected
    1 |.a { ::: invalid css ::: }
------------^
      `.trim(),
    },
  ],
  [
    'malformed css found in lenient mode',
    {
      report: compatibleReport,
      expectedExitCode: 0,
      path: 'this/contains/bad/css',
      mockKompatRc: {
        browsers: MODERN_CHROME_CONFIG,
      },
      cssFinderOverride: [
        {
          path: 'this/contains/bad/css/malformed.css',
          type: 'css',
          contents: '.a { ::: invalid css ::: }',
        },
      ],
      expectedCssParsingErrors: [
        `
Parse error: Identifier is expected
    1 |.a { ::: invalid css ::: }
------------^
        `.trim(),
      ],
    },
  ],
  [
    'run command file not found',
    {
      report: compatibleReport,
      expectedExitCode: 2,
      mockKompatRc: null,
      expectedErrorMessage:
        'Error: Could not find .kompatrc.yml or .kompatrc.yaml file.',
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
  [
    'malformed feature ignores',
    {
      report: incompatibleReport,
      mockKompatRc: {
        browsers: MODERN_CHROME_CONFIG,
        featureIgnores: ['property:color:'],
      },
      expectedExitCode: 2,
      expectedErrorMessage: `
Error: Malformed rule overrides config: [
  {
    "code": "custom",
    "message": "Invalid feature ID: must have no more than 3 colons, no consecutive colons and no colons at the start or end of the ID.",
    "path": [
      0
    ]
  }
]
      `.trim(),
    },
  ],
  [
    'malformed report options',
    {
      report: incompatibleReport,
      mockKompatRc: {
        browsers: MODERN_CHROME_CONFIG,
        reportOptions: {
          includePerFeatureSummary: 'bad',
        },
      },
      expectedExitCode: 2,
      expectedErrorMessage: `
Error: Malformed report options config: [
  {
    "code": "invalid_type",
    "expected": "boolean",
    "received": "string",
    "path": [
      "includePerFeatureSummary"
    ],
    "message": "Expected boolean, received string"
  }
]
      `.trim(),
    },
  ],
  [
    'malformed file extension ignores',
    {
      report: incompatibleReport,
      mockKompatRc: {
        browsers: MODERN_CHROME_CONFIG,
        fileExtensionIgnores: ['bad'],
      },
      expectedExitCode: 2,
      expectedErrorMessage: `
Error: Malformed file extension ignores config: [
  {
    "received": "bad",
    "code": "invalid_enum_value",
    "options": [
      "css",
      "sass",
      "scss",
      "less"
    ],
    "path": [
      0
    ],
    "message": "Invalid enum value. Expected 'css' | 'sass' | 'scss' | 'less', received 'bad'"
  }
]
      `.trim(),
    },
  ],
  [
    'error thrown from CSS finder',
    {
      report: compatibleReport,
      cssFinderOverride: { errorMessage: 'Bad SASS syntax' },
      expectedExitCode: 1,
      expectedErrorMessage: 'Error: Bad SASS syntax',
    },
  ],
  [
    'ignored feature',
    {
      report: compatibleReport,
      expectedExitCode: 0,
      mockKompatRc: {
        browsers: MODERN_CHROME_CONFIG,
        featureIgnores: ['property:margin'],
      },
    },
  ],
];

beforeEach(() => {
  jest
    .spyOn(cssParserModule, 'getFormattedCss')
    .mockReturnValueOnce(dummyFormattedCss);
});

test.each(testCases)(
  'exits with expected status code and message for case: %s',
  async (
    _,
    {
      report,
      expectedExitCode,
      expectedErrorMessage,
      path,
      mockKompatRc,
      cssFinderOverride,
      expectedRules,
      expectedCssParsingErrors,
    },
  ) => {
    const getCompatibilityReportSpy = jest
      .spyOn(compatibilityReportModule, 'getCompatibilityReport')
      .mockReturnValueOnce(report);
    jest
      .spyOn(filepathHelperModule, 'isValidFilepath')
      .mockReturnValueOnce(path !== invalidCssPath);

    if (cssFinderOverride && 'errorMessage' in cssFinderOverride) {
      jest
        .spyOn(cssFinderModule, 'getAllCssFiles')
        .mockImplementationOnce(() => {
          throw new Error(cssFinderOverride.errorMessage);
        });
    } else {
      jest
        .spyOn(cssFinderModule, 'getAllCssFiles')
        .mockReturnValueOnce(
          Promise.resolve(
            cssFinderOverride !== undefined
              ? cssFinderOverride
              : [dummyCssFile],
          ),
        );
    }

    const getKompatRcSpy = jest.spyOn(kompatRcModule, 'getKompatRc');
    if (mockKompatRc === null) {
      getKompatRcSpy.mockImplementationOnce(() => {
        throw new ClientError(
          'Could not find .kompatrc.yml or .kompatrc.yaml file.',
        );
      });
    } else {
      getKompatRcSpy.mockReturnValueOnce(
        mockKompatRc ?? { browsers: MODERN_CHROME_CONFIG },
      );
    }

    let exitCode: ExitCode | null = null;
    let errorMessage: string | undefined = undefined;
    const exitWith = (code: ExitCode, message?: string): ExitCode => {
      exitCode = code;
      errorMessage = message;
      return code;
    };

    await runCli(exitWith, path);

    if (expectedErrorMessage) {
      expect(getCompatibilityReportSpy).not.toHaveBeenCalled();
    } else {
      expect(getCompatibilityReportSpy).toHaveBeenCalledWith(
        dummyFormattedCss,
        mockKompatRc?.browsers ?? MODERN_CHROME_CONFIG,
        (Array.isArray(cssFinderOverride) && cssFinderOverride[0].path) ||
          dummyCssFile.path,
        expectedRules ?? DEFAULT_RULES,
        mockKompatRc?.featureIgnores ?? [],
        expectedCssParsingErrors ?? [],
      );
    }

    expect(exitCode).toEqual(expectedExitCode);
    expect(errorMessage).toEqual(expectedErrorMessage);
  },
);

test('cli returns status 1 with generic message when an error is thrown that does not extend "Error"', async () => {
  jest.spyOn(kompatRcModule, 'getKompatRc').mockImplementationOnce(() => {
    throw 'this is a string';
  });

  let exitCode: ExitCode | null = null;
  let errorMessage: string | undefined = undefined;
  const exitWith = (code: ExitCode, message?: string): ExitCode => {
    exitCode = code;
    errorMessage = message;
    return code;
  };

  await runCli(exitWith);

  expect(exitCode).toEqual(1);
  expect(errorMessage).toEqual('Error: Unknown Error');
});

test('cli returns status 1 with message when an error is thrown that extends "Error" but does not extend "BaseKompatError"', async () => {
  jest.spyOn(kompatRcModule, 'getKompatRc').mockImplementationOnce(() => {
    throw new Error('This is a message');
  });

  let exitCode: ExitCode | null = null;
  let errorMessage: string | undefined = undefined;
  const exitWith = (code: ExitCode, message?: string): ExitCode => {
    exitCode = code;
    errorMessage = message;
    return code;
  };

  await runCli(exitWith);

  expect(exitCode).toEqual(1);
  expect(errorMessage).toEqual('Error: This is a message');
});
