import { FileExtension } from '../helpers/filetype-helper';
import { Browser } from './browser';
import { ParserOptions } from './parser-options';
import { ReportOptions } from './report-options';
import { Rules } from './rules';

export type UnvalidatedKompatRc = {
  browsers?: unknown;
  ruleOverrides?: unknown;
  featureIgnores?: unknown;
  parserOptions?: unknown;
  reportOptions?: unknown;
  fileExtensionIgnores?: unknown;
};

export type ValidatedKompatRc = {
  browserConfig: Browser[];
  ruleOverrides: Partial<Rules>;
  featureIgnores: string[];
  parserOptions: ParserOptions;
  reportOptions: ReportOptions;
  fileExtensionIgnores: FileExtension[];
};
