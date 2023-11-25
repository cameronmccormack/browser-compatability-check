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
