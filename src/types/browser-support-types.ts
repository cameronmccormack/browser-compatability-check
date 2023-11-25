export type FeatureSupport = {
  [browser: string]: FeatureDetailsForBrowser;
};

export type FeatureDetailsForBrowser = {
  sinceVersion: number;
  untilVersion?: number;
  isPartialSupport: boolean;
  isFlagged: boolean;
  notes?: string;
}[];
