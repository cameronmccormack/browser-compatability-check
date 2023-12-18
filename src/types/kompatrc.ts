import { Browser } from './browser';
import { ReportOptions } from './report-options';
import { Rules } from './rules';

export type UnvalidatedKompatRc = {
  browsers?: unknown;
  ruleOverrides?: unknown;
  featureIgnores?: unknown;
  reportOptions?: unknown;
};

type ValidationError = { error: string };

export type ValidatedKompatRc = {
  browserConfig: Browser[] | ValidationError;
  ruleOverrides: Partial<Rules> | ValidationError;
  featureIgnores: string[] | ValidationError;
  reportOptions: ReportOptions | ValidationError;
};
