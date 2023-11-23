import { CompatStatement, Identifier } from '@mdn/browser-compat-data/types';
import { findCompatNode } from '../../src/browser-support/find-compat-node';

const getChromeCompatStatementForVersion = (
  version: string,
): CompatStatement => ({
  support: {
    chrome: {
      version_added: version,
      flags: [],
    },
  },
});

const DATA_TO_TRAVERSE = {
  __compat: getChromeCompatStatementForVersion('0'),
  a1: {
    __compat: getChromeCompatStatementForVersion('a1'),
    a1b1: {
      __compat: getChromeCompatStatementForVersion('a1b1'),
      a1b1c1: {
        __compat: getChromeCompatStatementForVersion('a1b1c1'),
      },
      a1b1c2: {
        __compat: getChromeCompatStatementForVersion('a1b1c2'),
      },
    },
    a1b2: {
      __compat: getChromeCompatStatementForVersion('a1b2'),
      a1b2c1: {
        __compat: getChromeCompatStatementForVersion('a1b2c1'),
      },
      a1b2c2: {
        __compat: getChromeCompatStatementForVersion('a1b2c2'),
      },
    },
  },
  a2: {
    __compat: getChromeCompatStatementForVersion('a2'),
    a2b1: {
      __compat: getChromeCompatStatementForVersion('a2b1'),
      a2b1c1: {
        __compat: getChromeCompatStatementForVersion('a2b1c1'),
      },
      a2b1c2: {
        __compat: getChromeCompatStatementForVersion('a2b1c2'),
      },
    },
    a2b2: {
      __compat: getChromeCompatStatementForVersion('a2b2'),
      a2b2c1: {
        __compat: getChromeCompatStatementForVersion('a2b2c1'),
      },
      a2b2c2: {
        __compat: getChromeCompatStatementForVersion('a2b2c2'),
      },
    },
  },
};

test.each<string>([
  'a1',
  'a1b1',
  'a1b2',
  'a1b1c1',
  'a1b1c2',
  'a1b2c1',
  'a1b2c2',
  'a2',
  'a2b1',
  'a2b2',
  'a2b1c1',
  'a2b1c2',
  'a2b2c1',
  'a2b2c2',
  'a3',
  'a3b3',
  'a3b3c3',
])('finds expected value for node %s', (nodeName) => {
  expect(
    findCompatNode(nodeName, DATA_TO_TRAVERSE as unknown as Identifier),
  ).toEqual(
    nodeName.includes('3')
      ? null
      : getChromeCompatStatementForVersion(nodeName),
  );
});
