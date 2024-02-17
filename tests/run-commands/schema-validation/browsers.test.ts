import { ClientError } from '../../../src/errors/client-error';
import { getValidatedBrowserConfig } from '../../../src/run-commands/schema-validation/browsers';
import { Browser } from '../../../src/types/browser';
import { MODERN_CHROME_CONFIG } from '../../test-data/browser-configs';

type TestData = {
  inputConfig: unknown;
  expectedResult: Browser[] | { error: string };
};

const testCases: [string, TestData][] = [
  [
    'valid config',
    { inputConfig: MODERN_CHROME_CONFIG, expectedResult: MODERN_CHROME_CONFIG },
  ],
  [
    'malformed version number',
    {
      inputConfig: [{ identifier: 'chrome', version: 'not-a-number' }],
      expectedResult: {
        error:
          'Malformed browser config: [\n  {\n    "code": "invalid_type",\n    "expected": "number",\n    "received": "string",\n    "path": [\n      0,\n      "version"\n    ],\n    "message": "Expected number, received string"\n  }\n]',
      },
    },
  ],
  [
    'unknown browser slug',
    {
      inputConfig: [{ identifier: 'not-a-browser', version: 100 }],
      expectedResult: {
        error:
          'Malformed browser config: [\n  {\n    "received": "not-a-browser",\n    "code": "invalid_enum_value",\n    "options": [\n      "chrome",\n      "chrome_android",\n      "deno",\n      "edge",\n      "firefox",\n      "firefox_android",\n      "ie",\n      "nodejs",\n      "oculus",\n      "opera",\n      "opera_android",\n      "safari",\n      "safari_ios",\n      "samsunginternet_android",\n      "webview_android"\n    ],\n    "path": [\n      0,\n      "identifier"\n    ],\n    "message": "Invalid enum value. Expected \'chrome\' | \'chrome_android\' | \'deno\' | \'edge\' | \'firefox\' | \'firefox_android\' | \'ie\' | \'nodejs\' | \'oculus\' | \'opera\' | \'opera_android\' | \'safari\' | \'safari_ios\' | \'samsunginternet_android\' | \'webview_android\', received \'not-a-browser\'"\n  }\n]',
      },
    },
  ],
  [
    'not an array',
    {
      inputConfig: MODERN_CHROME_CONFIG[0],
      expectedResult: {
        error:
          'Malformed browser config: [\n  {\n    "code": "invalid_type",\n    "expected": "array",\n    "received": "object",\n    "path": [],\n    "message": "Expected array, received object"\n  }\n]',
      },
    },
  ],
  [
    'malformed object',
    {
      inputConfig: [{ nonsense: 'aargh' }],
      expectedResult: {
        error:
          'Malformed browser config: [\n  {\n    "expected": "\'chrome\' | \'chrome_android\' | \'deno\' | \'edge\' | \'firefox\' | \'firefox_android\' | \'ie\' | \'nodejs\' | \'oculus\' | \'opera\' | \'opera_android\' | \'safari\' | \'safari_ios\' | \'samsunginternet_android\' | \'webview_android\'",\n    "received": "undefined",\n    "code": "invalid_type",\n    "path": [\n      0,\n      "identifier"\n    ],\n    "message": "Required"\n  },\n  {\n    "code": "invalid_type",\n    "expected": "number",\n    "received": "undefined",\n    "path": [\n      0,\n      "version"\n    ],\n    "message": "Required"\n  }\n]',
      },
    },
  ],
  [
    'duplicate browser',
    {
      inputConfig: [
        { identifier: 'chrome', version: 1 },
        { identifier: 'chrome', version: 2 },
        { identifier: 'chrome', version: 3 },
        { identifier: 'firefox', version: 4 },
        { identifier: 'firefox', version: 5 },
        { identifier: 'firefox', version: 6 },
      ],
      expectedResult: {
        error: 'Duplicate browsers in config. Duplicates: chrome, firefox.',
      },
    },
  ],
];

test.each<[string, TestData]>(testCases)(
  'Correctly validates browser config for case: %s',
  (_, { inputConfig, expectedResult }) => {
    if ('error' in expectedResult) {
      expect(() => getValidatedBrowserConfig(inputConfig)).toThrow(
        new ClientError(expectedResult.error),
      );
    } else {
      expect(getValidatedBrowserConfig(inputConfig)).toEqual(expectedResult);
    }
  },
);
