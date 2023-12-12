import { OverallResult } from './overall-result';

export type Rules = {
  compatible: OverallResult;
  'partial-support': OverallResult;
  flagged: OverallResult;
  unknown: OverallResult;
  incompatible: OverallResult;
  'unknown-feature': OverallResult;
};
