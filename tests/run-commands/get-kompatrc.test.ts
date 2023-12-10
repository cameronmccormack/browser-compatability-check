import { getKompatRc } from '../../src/run-commands/get-kompatrc';

const DUMMY_KOMPAT_RC_CONTENTS = {
  browsers: [
    {
      identifier: 'chrome',
      version: 100,
    },
    {
      identifier: 'firefox',
      version: 100,
    },
    {
      identifier: 'edge',
      version: 23,
    },
  ],
};

test('gets valid kompatrc using YML extension', () => {
  expect(getKompatRc('tests/test-data/dummy-kompatrc-files')).toEqual(
    DUMMY_KOMPAT_RC_CONTENTS,
  );
});

test('gets valid kompatrc using YAML extension', () => {
  expect(getKompatRc('tests/test-data/dummy-kompatrc-files/yaml-only')).toEqual(
    DUMMY_KOMPAT_RC_CONTENTS,
  );
});

test('returns null when no .yml/.yaml files present', () => {
  expect(getKompatRc('tests/test-data/dummy-kompatrc-files/json-only')).toEqual(
    null,
  );
});
