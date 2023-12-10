import { z } from 'zod';
import { RuleOverridesSchema } from '../schema-validation/rule-overrides';
import { OverallResult } from './overall-result';

export type RuleOverrides = z.infer<typeof RuleOverridesSchema>;

export type Rules = {
  compatible: OverallResult;
  'partial-support': OverallResult;
  flagged: OverallResult;
  unknown: OverallResult;
  incompatible: OverallResult;
  'unknown-feature': OverallResult;
};
