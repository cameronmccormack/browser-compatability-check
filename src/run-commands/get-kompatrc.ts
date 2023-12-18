import fs from 'fs';
import YAML from 'yaml';
import { UnvalidatedKompatRc } from '../types/kompatrc';

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
