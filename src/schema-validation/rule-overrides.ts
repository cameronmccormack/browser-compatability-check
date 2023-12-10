import { z } from 'zod';
import { RuleOverrides } from '../types/rule-overrides';

// The schema below is linked directly from the README.
// Please update the README link and/or line reference if modifying this file.
const RuleResultSchema = z.enum(['pass', 'warn', 'fail']).optional();
export const RuleOverridesSchema = z
  .object({
    compatible: RuleResultSchema,
    'partial-support': RuleResultSchema,
    flagged: RuleResultSchema,
    incompatible: RuleResultSchema,
    unknown: RuleResultSchema,
    'unknown-feature': RuleResultSchema,
  })
  .optional();

export const getValidatedRuleOverrides = (
  rawConfig: unknown,
): RuleOverrides | { error: string } => {
  const parsedConfig = RuleOverridesSchema.safeParse(rawConfig);

  return parsedConfig.success
    ? parsedConfig.data
    : { error: `Malformed rule overrides config: ${parsedConfig.error}` };
};
