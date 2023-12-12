import { Rules } from '../types/rules';

export const DEFAULT_RULES: Rules = {
  compatible: 'pass',
  'partial-support': 'warn',
  flagged: 'warn',
  unknown: 'warn',
  incompatible: 'fail',
  'unknown-feature': 'fail',
};
