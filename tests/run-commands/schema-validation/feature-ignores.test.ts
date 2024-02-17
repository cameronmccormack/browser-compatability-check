import { ClientError } from '../../../src/errors/client-error';
import { getValidatedFeatureIgnores } from '../../../src/run-commands/schema-validation/feature-ignores';

type TestData = {
  inputConfig: unknown;
  expectedResult: string[] | { error: string };
};

const CUSTOM_ERROR = `
Malformed rule overrides config: [
  {
    "code": "custom",
    "message": "Invalid feature ID: must have no more than 3 colons, no consecutive colons and no colons at the start or end of the ID.",
    "path": [
      0
    ]
  }
]
`.trim();

const testCases: [string, TestData][] = [
  [
    'valid config',
    {
      inputConfig: [
        'at-rule',
        'function:rgb',
        'property:color:red',
        'property:gap:20px:flex_context',
      ],
      expectedResult: [
        'at-rule',
        'function:rgb',
        'property:color:red',
        'property:gap:20px:flex_context',
      ],
    },
  ],
  [
    'undefined input',
    {
      inputConfig: undefined,
      expectedResult: [],
    },
  ],
  [
    'empty string input',
    {
      inputConfig: [''],
      expectedResult: { error: CUSTOM_ERROR },
    },
  ],
  [
    'whitespace string input',
    {
      inputConfig: ['  '],
      expectedResult: { error: CUSTOM_ERROR },
    },
  ],
  [
    'too many parts in id',
    {
      inputConfig: ['property:display:flex:flex_context:another-item'],
      expectedResult: { error: CUSTOM_ERROR },
    },
  ],
  [
    'empty part of id',
    {
      inputConfig: ['property::flex'],
      expectedResult: { error: CUSTOM_ERROR },
    },
  ],
  [
    'leading colon',
    {
      inputConfig: [':property:display:flex'],
      expectedResult: { error: CUSTOM_ERROR },
    },
  ],
  [
    'trailing colon',
    {
      inputConfig: ['property:display:flex:'],
      expectedResult: { error: CUSTOM_ERROR },
    },
  ],
  [
    'not an array',
    {
      inputConfig: 'property:display:flex',
      expectedResult: {
        error: `
Malformed rule overrides config: [
  {
    "code": "invalid_type",
    "expected": "array",
    "received": "string",
    "path": [],
    "message": "Expected array, received string"
  }
]
      `.trim(),
      },
    },
  ],
];

test.each<[string, TestData]>(testCases)(
  'Correctly validates feature ignores for case: %s',
  (_, { inputConfig, expectedResult }) => {
    if ('error' in expectedResult) {
      expect(() => getValidatedFeatureIgnores(inputConfig)).toThrow(
        new ClientError(expectedResult.error),
      );
    } else {
      expect(getValidatedFeatureIgnores(inputConfig)).toEqual(expectedResult);
    }
  },
);
