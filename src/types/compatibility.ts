import { OverallResult } from './overall-result';

export type CompatibilityReport = {
  filePath: string;
  overallStatus: OverallResult;
  knownFeatures: {
    [featureId: string]: Compatibility;
  };
  unknownFeatures: string[];
  browserSummaries: BrowserSummaries;
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
