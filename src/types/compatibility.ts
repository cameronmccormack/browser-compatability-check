import { OverallResult } from './overall-result';
import { Rules } from './rules';

export type OverallReport = {
  overallResult: OverallResult;
  reports: CompatibilityReport[];
  includePerFeatureSummary: boolean;
  rules: Rules;
};

export type CompatibilityReport = {
  filePath: string;
  overallStatus: OverallResult;
  knownFeatures: {
    [featureId: string]: Compatibility;
  };
  unknownFeatures: string[];
  browserSummaries: BrowserSummaries;
  cssParsingErrors: string[];
};

export type BrowserSummaries = {
  [browser: string]: BrowserSummary;
};

export type BrowserSummary = {
  compatible: number;
  'partial-support': number;
  flagged: number;
  incompatible: number;
  unknown: number;
};

export type Compatibility = {
  [browser: string]: BrowserCompatibility;
};

export type BrowserCompatibility = {
  compatibility: BrowserCompatibilityState;
  notes?: string;
};

export type BrowserCompatibilityState =
  | 'compatible'
  | 'flagged'
  | 'partial-support'
  | 'incompatible'
  | 'unknown';
