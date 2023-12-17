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

export enum ExitCode {
  Compatible = 0,
  Incompatible = 1,
  BadArgsOrException = 2,
}

export const runCli = (
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

  const validatedBrowserConfig = getValidatedBrowserConfig(
    kompatRcFile.browsers,
  );
  if ('error' in validatedBrowserConfig) {
    return exitWith(2, `Error: ${validatedBrowserConfig.error}`);
  }

  const validatedRuleOverrides = getValidatedRuleOverrides(
    kompatRcFile.ruleOverrides,
  );
  if ('error' in validatedRuleOverrides) {
    return exitWith(2, `Error: ${validatedRuleOverrides.error}`);
  }

  const formattedPath = relativePath?.replaceAll(/\/+$|^\.\//g, '');
  const absolutePath = `${currentWorkingDirectory}${
    formattedPath ? `/${formattedPath}` : ''
  }`;

  const cssFiles = getAllCssFiles(absolutePath);
  if (cssFiles === null) {
    return exitWith(2, `Error: Invalid filepath: ${absolutePath}.`);
  }
  if (cssFiles.length === 0) {
    return exitWith(1, `Error: No CSS files found.`);
  }

  const rules = {
    ...DEFAULT_RULES,
    ...validatedRuleOverrides,
  };

  const reports: CompatibilityReport[] = [];
  cssFiles.forEach((file) => {
    const formattedCss = getFormattedCss(csstree.parse(file.contents));
    reports.push(
      getCompatibilityReport(
        formattedCss,
        validatedBrowserConfig,
        file.path.replace(currentWorkingDirectory, '.'),
        rules,
      ),
    );
  });

  const overallStatus = getOverallStatus(reports);
  printCompatibilityReports(reports, overallStatus, rules);

  return exitWith(overallStatus === 'fail' ? 1 : 0);
};
