import { FileExtension } from '../helpers/filetype-helper';
import { Browser } from './browser';
import { ReportOptions } from './report-options';
import { Rules } from './rules';

export type UnvalidatedKompatRc = {
  browsers?: unknown;
  ruleOverrides?: unknown;
  featureIgnores?: unknown;
  reportOptions?: unknown;
  fileExtensionIgnores?: unknown;
};

export type ValidationError = { error: string };

export type ValidatedKompatRc = {
  browserConfig: Browser[] | ValidationError;
  ruleOverrides: Partial<Rules> | ValidationError;
  featureIgnores: string[] | ValidationError;
  reportOptions: ReportOptions | ValidationError;
  fileExtensionIgnores: FileExtension[] | ValidationError;
};
