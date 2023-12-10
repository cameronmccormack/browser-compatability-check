import fs from 'fs';
import YAML from 'yaml';

type UnvalidatedKompatRc = {
  browsers?: unknown;
  ruleOverrides?: unknown;
};

const getRawKompatRc = (currentWorkingDirectory: string): string | null => {
  try {
    return fs.readFileSync(`${currentWorkingDirectory}/.kompatrc.yml`, 'utf8');
  } catch {
    try {
      return fs.readFileSync(
        `${currentWorkingDirectory}/.kompatrc.yaml`,
        'utf8',
      );
    } catch {
      return null;
    }
  }
};

export const getKompatRc = (
  currentWorkingDirectory: string,
): null | UnvalidatedKompatRc => {
  const kompatRcFile = getRawKompatRc(currentWorkingDirectory);
  return kompatRcFile === null ? null : YAML.parse(kompatRcFile);
};
