import { FileExtension } from '../../../src/helpers/filetype-helper';
import { getValidatedFileExtensionIgnores } from '../../../src/run-commands/schema-validation/file-extension-ignores';
import { ValidationError } from '../../../src/types/kompatrc';

type TestData = {
  inputConfig: unknown;
  expectedResult: FileExtension[] | ValidationError;
};

const testCases: [string, TestData][] = [
  [
    'valid config',
    {
      inputConfig: ['sass', 'less', 'scss', 'css'],
      expectedResult: ['sass', 'less', 'scss', 'css'],
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
      expectedResult: {
        error: `
Malformed file extension ignores config: [
  {
    "received": "",
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
    "message": "Invalid enum value. Expected 'css' | 'sass' | 'scss' | 'less', received ''"
  }
]
      `.trim(),
      },
    },
  ],
  [
    'whitespace string input',
    {
      inputConfig: [' '],
      expectedResult: {
        error: `
Malformed file extension ignores config: [
  {
    "received": " ",
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
    "message": "Invalid enum value. Expected 'css' | 'sass' | 'scss' | 'less', received ' '"
  }
]
      `.trim(),
      },
    },
  ],
  [
    'unexpected file extension',
    {
      inputConfig: ['xml'],
      expectedResult: {
        error: `
Malformed file extension ignores config: [
  {
    "received": "xml",
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
    "message": "Invalid enum value. Expected 'css' | 'sass' | 'scss' | 'less', received 'xml'"
  }
]
      `.trim(),
      },
    },
  ],
  [
    'duplicate element',
    {
      inputConfig: ['css', 'css', 'css'],
      expectedResult: ['css', 'css', 'css'],
    },
  ],
  [
    'not an array',
    {
      inputConfig: 'css',
      expectedResult: {
        error: `
Malformed file extension ignores config: [
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
  'Correctly validates file extension ignores for case: %s',
  (_, { inputConfig, expectedResult }) => {
    expect(getValidatedFileExtensionIgnores(inputConfig)).toEqual(
      expectedResult,
    );
  },
);
