export type FeatureSupport = {
  [browser: string]: {
    sinceVersion: number;
    flagged: boolean;
  };
};
