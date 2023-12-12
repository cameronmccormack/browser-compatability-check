import { z } from 'zod';
import { Rules } from '../types/rule-overrides';

// The schema below is linked directly from the README.
// Please update the README link and/or line reference if modifying this file.
const RuleResultSchema = z.enum(['pass', 'warn', 'fail']);
export const RuleOverridesSchema = z
  .object({
    compatible: RuleResultSchema,
    'partial-support': RuleResultSchema,
    flagged: RuleResultSchema,
    incompatible: RuleResultSchema,
    unknown: RuleResultSchema,
    'unknown-feature': RuleResultSchema,
  })
  .partial();

export const getValidatedRuleOverrides = (
  rawConfig: unknown,
): Partial<Rules> | { error: string } => {
  const parsedConfig = RuleOverridesSchema.safeParse(rawConfig);

  if (parsedConfig.success) {
    const parsedConfigWithUndefinedFieldsRemoved = {
      ...Object.fromEntries(
        Object.entries(parsedConfig.data ?? {}).filter(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, result]) => result != null,
        ),
      ),
    };
    return parsedConfigWithUndefinedFieldsRemoved;
  }

  return { error: `Malformed rule overrides config: ${parsedConfig.error}` };
};
