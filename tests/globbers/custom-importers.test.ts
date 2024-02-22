import { sassTildeCustomImporter } from '../../src/globbers/custom-importers';

describe('SASS custom importers', () => {
  test('replaces tilde with node_modules directory path', () => {
    expect(
      sassTildeCustomImporter.findFileUrl('~package/directory/file.scss'),
    ).toEqual(
      new URL(
        `file://${process.cwd()}/node_modules/package/directory/file.scss`,
      ),
    );
  });

  test('returns null if import does not start with tilde', () => {
    expect(
      sassTildeCustomImporter.findFileUrl('package/directory/file.scss'),
    ).toBe(null);
  });
});
