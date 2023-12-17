import { BrowserCompatibilityState } from './compatibility';
import { Chalk } from 'chalk';

export interface StyledValue<T extends string = string> {
  value: T;
  styles?: Chalk;
}

export type TabulatedFeatures = {
  [feature: string]: {
    [browser: string]: StyledValue<BrowserCompatibilityState>;
  };
};

export type TabulatedBrowserSummaries = {
  [browser: string]: StyledBrowserSummary;
};

export type StyledBrowserSummary = {
  compatible: StyledValue;
  flagged: StyledValue;
  'partial-support': StyledValue;
  unknown: StyledValue;
  incompatible: StyledValue;
};
