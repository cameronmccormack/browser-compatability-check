import { getValidatedRuleOverrides } from '../../../src/run-commands/schema-validation/rule-overrides';
import { ValidationError } from '../../../src/types/kompatrc';
import { Rules } from '../../../src/types/rules';

type TestData = {
  inputConfig: unknown;
  expectedResult: Partial<Rules> | ValidationError;
};

const testCases: [string, TestData][] = [
  [
    'valid config',
    {
      inputConfig: {
        compatible: 'pass',
        'partial-support': 'warn',
        flagged: 'fail',
        incompatible: 'pass',
        unknown: 'warn',
        'unknown-feature': 'fail',
      },
      expectedResult: {
        compatible: 'pass',
        'partial-support': 'warn',
        flagged: 'fail',
        incompatible: 'pass',
        unknown: 'warn',
        'unknown-feature': 'fail',
      },
    },
  ],
  [
    'valid config with subset of rules',
    {
      inputConfig: {
        flagged: 'fail',
        incompatible: 'pass',
      },
      expectedResult: {
        flagged: 'fail',
        incompatible: 'pass',
      },
    },
  ],
  [
    'undefined input',
    {
      inputConfig: undefined,
      expectedResult: {},
    },
  ],
  [
    'unexpected property value',
    {
      inputConfig: {
        compatible: 'bad',
      },
      expectedResult: {
        error: `
Malformed rule overrides config: [
  {
    "received": "bad",
    "code": "invalid_enum_value",
    "options": [
      "pass",
      "warn",
      "fail"
    ],
    "path": [
      "compatible"
    ],
    "message": "Invalid enum value. Expected 'pass' | 'warn' | 'fail', received 'bad'"
  }
]
      `.trim(),
      },
    },
  ],
  [
    'unexpected property key',
    {
      inputConfig: {
        somethingElse: 'pass',
      },
      expectedResult: {
        error: `
Malformed rule overrides config: [
  {
    "code": "unrecognized_keys",
    "keys": [
      "somethingElse"
    ],
    "path": [],
    "message": "Unrecognized key(s) in object: 'somethingElse'"
  }
]
      `.trim(),
      },
    },
  ],
];

test.each<[string, TestData]>(testCases)(
  'Correctly validates file extension ignores for case: %s',
  (_, { inputConfig, expectedResult }) => {
    expect(getValidatedRuleOverrides(inputConfig)).toEqual(expectedResult);
  },
);
