export type BrowserSupport = {
  [feature: string]: FeatureSupport;
};

export type FeatureSupport = {
  [browser: string]: {
    sinceVersion: number;
    flagged: boolean;
  };
};
