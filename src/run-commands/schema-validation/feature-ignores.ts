import { z } from 'zod';
import { ClientError } from '../../errors/client-error';

const featureIdValidator = (input: string): boolean => {
  const trimmedInput = input.trim();
  if (
    trimmedInput.length === 0 ||
    trimmedInput.includes('::') ||
    trimmedInput.startsWith(':') ||
    trimmedInput.endsWith(':')
  ) {
    return false;
  }

  const colonCount = trimmedInput.split(':').length - 1;
  return colonCount <= 3;
};

// The schema below is linked directly from the README.
// Please update the README link and/or line reference if modifying this file.
const FeatureIgnoresSchema = z.array(
  z.string().refine(featureIdValidator, {
    message:
      'Invalid feature ID: must have no more than 3 colons, no consecutive colons and no colons at the start or end of the ID.',
  }),
);

export const getValidatedFeatureIgnores = (rawConfig: unknown): string[] => {
  if (rawConfig === undefined) {
    return [];
  }

  const parsedConfig = FeatureIgnoresSchema.safeParse(rawConfig);

  if (parsedConfig.success) {
    return parsedConfig.data.map((id) => id.trim());
  }

  throw new ClientError(
    `Malformed rule overrides config: ${parsedConfig.error}`,
  );
};
