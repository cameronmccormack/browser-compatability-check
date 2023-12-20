import { getValidatedReportOptions } from '../../../src/run-commands/schema-validation/report-options';
import { ReportOptions } from '../../../src/types/report-options';

type TestData = {
  inputConfig: unknown;
  expectedResult: ReportOptions | { error: string };
};

const DEFAULT_REPORT_OPTIONS = {
  includePerFeatureSummary: true,
  outputReportFiles: [],
};

const testCases: [string, TestData][] = [
  [
    'valid config',
    {
      inputConfig: {
        includePerFeatureSummary: false,
        outputReportFiles: [
          {
            type: 'json',
            location: 'example/file.json',
          },
          {
            type: 'html',
            location: 'example/file.html',
          },
        ],
      },
      expectedResult: {
        includePerFeatureSummary: false,
        outputReportFiles: [
          {
            type: 'json',
            location: 'example/file.json',
          },
          {
            type: 'html',
            location: 'example/file.html',
          },
        ],
      },
    },
  ],
  [
    'undefined input',
    {
      inputConfig: undefined,
      expectedResult: DEFAULT_REPORT_OPTIONS,
    },
  ],
  [
    'missing explicit per-feature summary config',
    {
      inputConfig: {
        outputReportFiles: [
          {
            type: 'json',
            location: 'example/file.json',
          },
        ],
      },
      expectedResult: {
        includePerFeatureSummary:
          DEFAULT_REPORT_OPTIONS.includePerFeatureSummary,
        outputReportFiles: [
          {
            type: 'json',
            location: 'example/file.json',
          },
        ],
      },
    },
  ],
  [
    'missing explicit output report files',
    {
      inputConfig: { includePerFeatureSummary: false },
      expectedResult: {
        includePerFeatureSummary: false,
        outputReportFiles: DEFAULT_REPORT_OPTIONS.outputReportFiles,
      },
    },
  ],
  [
    'empty object',
    {
      inputConfig: {},
      expectedResult: DEFAULT_REPORT_OPTIONS,
    },
  ],
  [
    'invalid report type',
    {
      inputConfig: {
        outputReportFiles: [
          {
            type: 'xml',
            location: 'example/file.xml',
          },
        ],
      },
      expectedResult: {
        error: `
Malformed report options config: [
  {
    "received": "xml",
    "code": "invalid_enum_value",
    "options": [
      "html",
      "json"
    ],
    "path": [
      "outputReportFiles",
      0,
      "type"
    ],
    "message": "Invalid enum value. Expected 'html' | 'json', received 'xml'"
  }
]
      `.trim(),
      },
    },
  ],
  [
    'report files not an array',
    {
      inputConfig: {
        outputReportFiles: {
          type: 'xml',
          location: 'example/file.xml',
        },
      },
      expectedResult: {
        error: `
Malformed report options config: [
  {
    "code": "invalid_type",
    "expected": "array",
    "received": "object",
    "path": [
      "outputReportFiles"
    ],
    "message": "Expected array, received object"
  }
]
      `.trim(),
      },
    },
  ],
  [
    'invalid per-feature value',
    {
      inputConfig: {
        includePerFeatureSummary: 'true',
      },
      expectedResult: {
        error: `
Malformed report options config: [
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
    },
  ],
];

test.each<[string, TestData]>(testCases)(
  'Correctly validates report options for case: %s',
  (_, { inputConfig, expectedResult }) => {
    expect(getValidatedReportOptions(inputConfig)).toEqual(expectedResult);
  },
);
