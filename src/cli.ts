import * as csstree from 'css-tree';
import { getAllCssFiles } from './globbers/css-globber';
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
import { getValidatedFileExtensionIgnores } from './run-commands/schema-validation/file-extension-ignores';
import { BaseKompatError } from './errors/base-kompat-error';
import { ClientError } from './errors/client-error';
import { InternalError } from './errors/internal-error';
import { getValidatedParserOptions } from './run-commands/schema-validation/parser-options';

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
  parserOptions: getValidatedParserOptions(unvalidatedFile.parserOptions),
  reportOptions: getValidatedReportOptions(unvalidatedFile.reportOptions),
  fileExtensionIgnores: getValidatedFileExtensionIgnores(
    unvalidatedFile.fileExtensionIgnores,
  ),
});

export const runCli = async (
  exitWith: (code: ExitCode, errorMessage?: string) => ExitCode,
  relativePath?: string,
): Promise<ExitCode> => {
  try {
    return await runCliWithoutErrorWrapper(exitWith, relativePath);
  } catch (e) {
    if (e instanceof BaseKompatError) {
      return exitWith(e.exitCode, `Error: ${e.message}`);
    }

    if (e instanceof Error) {
      return exitWith(1, `Error: ${e.message}`);
    }

    return exitWith(1, 'Error: Unknown Error');
  }
};

const runCliWithoutErrorWrapper = async (
  exitWith: (code: ExitCode, errorMessage?: string) => ExitCode,
  relativePath?: string,
): Promise<ExitCode> => {
  const currentWorkingDirectory = process.cwd();

  const kompatRcFile = getKompatRc(currentWorkingDirectory);

  const {
    browserConfig,
    ruleOverrides,
    featureIgnores,
    parserOptions,
    reportOptions,
    fileExtensionIgnores,
  } = getValidatedKompatRc(kompatRcFile);

  const formattedPath = relativePath?.replaceAll(/\/+$|^\.\//g, '');
  const absolutePath = `${currentWorkingDirectory}${
    formattedPath ? `/${formattedPath}` : ''
  }`;

  if (!isValidFilepath(absolutePath)) {
    throw new ClientError(`Invalid filepath: ${absolutePath}.`);
  }

  const cssFiles = await getAllCssFiles(absolutePath, fileExtensionIgnores);
  if (cssFiles.length === 0) {
    throw new InternalError(`No CSS files found.`);
  }

  const rules = {
    ...DEFAULT_RULES,
    ...ruleOverrides,
  };

  const reports: CompatibilityReport[] = [];
  cssFiles.forEach((file) => {
    const cssParsingErrors: string[] = [];

    const formattedCss = getFormattedCss(
      csstree.parse(file.contents, {
        onParseError: ({ formattedMessage }) => {
          if (parserOptions.strict) {
            throw new InternalError(
              `Error in ${file.path}:\n\n${formattedMessage}`,
            );
          }
          cssParsingErrors.push(formattedMessage);
        },
      }),
    );
    reports.push(
      getCompatibilityReport(
        formattedCss,
        browserConfig,
        file.path.replace(currentWorkingDirectory, '.'),
        rules,
        featureIgnores,
        cssParsingErrors,
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
