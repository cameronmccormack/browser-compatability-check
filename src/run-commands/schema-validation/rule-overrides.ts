import { z } from 'zod';
import { Rules } from '../../types/rules';
import { ClientError } from '../../errors/client-error';

// The schema below is linked directly from the README.
// Please update the README link and/or line reference if modifying this file.
const RuleResultSchema = z.enum(['pass', 'warn', 'fail']);
const RuleOverridesSchema = z
  .object({
    compatible: RuleResultSchema,
    'partial-support': RuleResultSchema,
    flagged: RuleResultSchema,
    incompatible: RuleResultSchema,
    unknown: RuleResultSchema,
    'unknown-feature': RuleResultSchema,
  })
  .strict()
  .partial();

export const getValidatedRuleOverrides = (
  rawConfig: unknown,
): Partial<Rules> => {
  if (rawConfig === undefined) {
    return {};
  }

  const parsedConfig = RuleOverridesSchema.safeParse(rawConfig);

  if (parsedConfig.success) {
    return {
      ...Object.fromEntries(
        Object.entries(parsedConfig.data).filter(
          ([, result]) => result != null,
        ),
      ),
    };
  }

  throw new ClientError(
    `Malformed rule overrides config: ${parsedConfig.error}`,
  );
};
