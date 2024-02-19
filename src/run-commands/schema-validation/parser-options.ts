import { z } from 'zod';
import { ClientError } from '../../errors/client-error';
import { ParserOptions } from '../../types/parser-options';

// The schema below is linked directly from the README.
// Please update the README link and/or line reference if modifying this file.
const ParserOptionsSchema = z.object({
  strict: z.boolean().default(false),
});

export const getValidatedParserOptions = (
  rawConfig: unknown,
): ParserOptions => {
  const parsedConfig = ParserOptionsSchema.safeParse(rawConfig ?? {});

  if (parsedConfig.success) {
    return parsedConfig.data;
  }

  throw new ClientError(
    `Malformed parser options config: ${parsedConfig.error}`,
  );
};
