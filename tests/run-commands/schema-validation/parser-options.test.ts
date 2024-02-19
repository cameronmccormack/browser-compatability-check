import { ClientError } from '../../../src/errors/client-error';
import { getValidatedParserOptions } from '../../../src/run-commands/schema-validation/parser-options';
import { ParserOptions } from '../../../src/types/parser-options';

type TestData = {
  inputConfig: unknown;
  expectedResult: ParserOptions | { error: string };
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
        strict: true,
      },
      expectedResult: {
        strict: true,
      },
    },
  ],
  [
    'undefined input',
    {
      inputConfig: undefined,
      expectedResult: {
        strict: false,
      },
    },
  ],
  [
    'empty object input',
    {
      inputConfig: {},
      expectedResult: {
        strict: false,
      },
    },
  ],
  [
    'non-boolean value for strict',
    {
      inputConfig: {
        strict: 'maybe',
      },
      expectedResult: {
        error: `
Malformed parser options config: [
  {
    "code": "invalid_type",
    "expected": "boolean",
    "received": "string",
    "path": [
      "strict"
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
    if ('error' in expectedResult) {
      expect(() => getValidatedParserOptions(inputConfig)).toThrow(
        new ClientError(expectedResult.error),
      );
    } else {
      expect(getValidatedParserOptions(inputConfig)).toEqual(expectedResult);
    }
  },
);
