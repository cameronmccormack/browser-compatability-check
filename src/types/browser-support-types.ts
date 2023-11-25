export type FeatureSupport = {
  [browser: string]: {
    sinceVersion: number;
    untilVersion?: number;
    isPartialSupport: boolean;
    isFlagged: boolean;
  }[];
};
