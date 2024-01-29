import { getAllCssFiles } from './globbers/css-globber';
import * as csstree from 'css-tree';
import { getFormattedCss } from './tree-formatters/css/css-tree-formatter';
import { getCompatibilityReport } from './report-generators/get-compatibility-report';
import { CompatibilityReport } from './types/compatibility';
import { printCompatibilityReports } from './printers';
import { getValidatedBrowserConfig } from './run-commands/schema-validation/browsers';
import { getKompatRc } from './run-commands/get-kompatrc';
import { getValidatedRuleOverrides } from './run-commands/schema-validation/rule-overrides';
import { DEFAULT_RULES } from './run-commands/default-rules';
import { getOverallStatus } from './report-generators/get-overall-status';
import { getValidatedFeatureIgnores } from './run-commands/schema-validation/feature-ignores';
import { UnvalidatedKompatRc, ValidatedKompatRc } from './types/kompatrc';
import { getValidatedReportOptions } from './run-commands/schema-validation/report-options';
import { writeCompatibilityReportFiles } from './report-writers/report-writer';
import { isValidFilepath } from './helpers/filepath-helper';

export enum ExitCode {
  Compatible = 0,
  Incompatible = 1,
  BadArgsOrException = 2,
}

const getValidatedKompatRc = (
  unvalidatedFile: UnvalidatedKompatRc,
): ValidatedKompatRc => ({
  browserConfig: getValidatedBrowserConfig(unvalidatedFile.browsers),
  ruleOverrides: getValidatedRuleOverrides(unvalidatedFile.ruleOverrides),
  featureIgnores: getValidatedFeatureIgnores(unvalidatedFile.featureIgnores),
  reportOptions: getValidatedReportOptions(unvalidatedFile.reportOptions),
});

export const runCli = (
  exitWith: (code: ExitCode, errorMessage?: string) => ExitCode,
  relativePath?: string,
): ExitCode => {
  try {
    return runCliWithoutErrorWrapper(exitWith, relativePath);
  } catch (e) {
    return exitWith(1, e instanceof Error ? e.message : undefined);
  }
};

const runCliWithoutErrorWrapper = (
  exitWith: (code: ExitCode, errorMessage?: string) => ExitCode,
  relativePath?: string,
): ExitCode => {
  const currentWorkingDirectory = process.cwd();

  const kompatRcFile = getKompatRc(currentWorkingDirectory);
  if (kompatRcFile === null) {
    return exitWith(
      2,
      'Error: could not find .kompatrc.yml or .kompatrc.yaml file.',
    );
  }

  const { browserConfig, ruleOverrides, featureIgnores, reportOptions } =
    getValidatedKompatRc(kompatRcFile);

  if ('error' in browserConfig) {
    return exitWith(2, `Error: ${browserConfig.error}`);
  }

  if ('error' in ruleOverrides) {
    return exitWith(2, `Error: ${ruleOverrides.error}`);
  }

  if ('error' in featureIgnores) {
    return exitWith(2, `Error: ${featureIgnores.error}`);
  }

  if ('error' in reportOptions) {
    return exitWith(2, `Error: ${reportOptions.error}`);
  }

  const formattedPath = relativePath?.replaceAll(/\/+$|^\.\//g, '');
  const absolutePath = `${currentWorkingDirectory}${
    formattedPath ? `/${formattedPath}` : ''
  }`;

  if (!isValidFilepath(absolutePath)) {
    return exitWith(2, `Error: Invalid filepath: ${absolutePath}.`);
  }

  const cssFiles = getAllCssFiles(absolutePath);
  if (cssFiles.length === 0) {
    return exitWith(1, `Error: No CSS files found.`);
  }

  const rules = {
    ...DEFAULT_RULES,
    ...ruleOverrides,
  };

  const reports: CompatibilityReport[] = [];
  cssFiles.forEach((file) => {
    const formattedCss = getFormattedCss(csstree.parse(file.contents));
    reports.push(
      getCompatibilityReport(
        formattedCss,
        browserConfig,
        file.path.replace(currentWorkingDirectory, '.'),
        rules,
        featureIgnores,
      ),
    );
  });

  const overallReport = {
    overallResult: getOverallStatus(reports),
    reports,
    includePerFeatureSummary: reportOptions.includePerFeatureSummary,
    rules,
  };

  printCompatibilityReports(overallReport);
  writeCompatibilityReportFiles(overallReport, reportOptions.outputReportFiles);

  return exitWith(overallReport.overallResult === 'fail' ? 1 : 0);
};
