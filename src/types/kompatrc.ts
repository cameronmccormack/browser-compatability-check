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

export type ValidatedKompatRc = {
  browserConfig: Browser[];
  ruleOverrides: Partial<Rules>;
  featureIgnores: string[];
  reportOptions: ReportOptions;
  fileExtensionIgnores: FileExtension[];
};
