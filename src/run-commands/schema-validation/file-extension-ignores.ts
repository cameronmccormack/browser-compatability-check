import { z } from 'zod';
import { FILE_EXTENSIONS, FileExtension } from '../../helpers/filetype-helper';
import { ClientError } from '../../errors/client-error';

const FileExtensionIgnoresSchema = z.array(z.enum(FILE_EXTENSIONS));

export const getValidatedFileExtensionIgnores = (
  rawConfig: unknown,
): FileExtension[] => {
  if (rawConfig === undefined) {
    return [];
  }

  const parsedConfig = FileExtensionIgnoresSchema.safeParse(rawConfig);

  if (parsedConfig.success) {
    return parsedConfig.data;
  }

  throw new ClientError(
    `Malformed file extension ignores config: ${parsedConfig.error}`,
  );
};
