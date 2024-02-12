import { z } from 'zod';
import { ValidationError } from '../../types/kompatrc';
import { FILE_EXTENSIONS, FileExtension } from '../../helpers/filetype-helper';

const FileExtensionIgnoresSchema = z.array(z.enum(FILE_EXTENSIONS));

export const getValidatedFileExtensionIgnores = (
  rawConfig: unknown,
): FileExtension[] | ValidationError => {
  if (rawConfig === undefined) {
    return [];
  }

  const parsedConfig = FileExtensionIgnoresSchema.safeParse(rawConfig);

  if (parsedConfig.success) {
    return parsedConfig.data;
  }

  return {
    error: `Malformed file extension ignores config: ${parsedConfig.error}`,
  };
};
