export type CompatibilityReport = {
  knownFeatures: {
    [featureId: string]: Compatibility;
  };
  unknownFeatures: string[];
  browserSummaries: {
    [browser: string]: {
      total: number;
      compatible: number;
      'partial-support': number;
      flagged: number;
      incompatible: number;
      unknown: number;
    };
  };
};

export type Compatibility = {
  [browser: string]: BrowserCompatibility;
};

export type BrowserCompatibility = {
  compatibility: BrowserCompatibilityState;
  notes?: string;
};

type BrowserCompatibilityState =
  | 'compatible'
  | 'flagged'
  | 'partial-support'
  | 'incompatible'
  | 'unknown';
