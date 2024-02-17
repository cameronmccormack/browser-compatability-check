import fs from 'fs';
import YAML from 'yaml';
import { UnvalidatedKompatRc } from '../types/kompatrc';
import { ClientError } from '../errors/client-error';

const getRawKompatRc = (currentWorkingDirectory: string): string => {
  try {
    return fs.readFileSync(`${currentWorkingDirectory}/.kompatrc.yml`, 'utf8');
  } catch {
    try {
      return fs.readFileSync(
        `${currentWorkingDirectory}/.kompatrc.yaml`,
        'utf8',
      );
    } catch {
      throw new ClientError(
        'Could not find .kompatrc.yml or .kompatrc.yaml file.',
      );
    }
  }
};

export const getKompatRc = (
  currentWorkingDirectory: string,
): UnvalidatedKompatRc => YAML.parse(getRawKompatRc(currentWorkingDirectory));
