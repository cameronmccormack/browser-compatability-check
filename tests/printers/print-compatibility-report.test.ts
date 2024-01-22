import { getOverallStatus } from '../../src/report-generators/get-overall-status';
import { printCompatibilityReports } from '../../src/printers';
import { CompatibilityReport } from '../../src/types/compatibility';
import {
  compatibleReport,
  emptyReport,
  flaggedCompatibilityReport,
  flaggedCompatibilityReportWithLongFeatureId,
  flaggedCompatibilityReportWithManyBrowsers,
  incompatibleReport,
  partiallyCompatibleReport,
  unknownFeatureReport,
} from '../test-data/compatibility-reports';
import {
  emptyPrintedReport,
  excludedPerFeatureSummariesPrintedReport,
  longFeatureIdPrintedReport,
  manyBrowsersPrintedReport,
  multipleFilesPrintedReport,
  nonDefaultRulesPrintedReport,
  oneCompatibleFilePrintedReport,
  oneFileWithUnknownFeaturePrintedReport,
} from './expected-printed-reports';
import { DEFAULT_RULES } from '../../src/run-commands/default-rules';
import { Rules } from '../../src/types/rules';

type TestData = {
  compatibilityReports: CompatibilityReport[];
  expectedPrintedReport: string;
  overrideRules?: Rules;
  includePerFeatureSummary?: boolean;
};

const testCases: [string, TestData][] = [
  [
    'one compatible report',
    {
      compatibilityReports: [compatibleReport],
      expectedPrintedReport: oneCompatibleFilePrintedReport,
    },
  ],
  [
    'one report with unknown feature',
    {
      compatibilityReports: [unknownFeatureReport],
      expectedPrintedReport: oneFileWithUnknownFeaturePrintedReport,
    },
  ],
  [
    'multiple reports',
    {
      compatibilityReports: [
        flaggedCompatibilityReport,
        compatibleReport,
        partiallyCompatibleReport,
      ],
      expectedPrintedReport: multipleFilesPrintedReport,
    },
  ],
  [
    '>3 browsers report',
    {
      compatibilityReports: [flaggedCompatibilityReportWithManyBrowsers],
      expectedPrintedReport: manyBrowsersPrintedReport,
    },
  ],
  [
    'very long CSS identifier report',
    {
      compatibilityReports: [flaggedCompatibilityReportWithLongFeatureId],
      expectedPrintedReport: longFeatureIdPrintedReport,
    },
  ],
  [
    'empty report',
    {
      compatibilityReports: [emptyReport],
      expectedPrintedReport: emptyPrintedReport,
    },
  ],
  [
    'non-default rules',
    {
      compatibilityReports: [
        flaggedCompatibilityReport,
        incompatibleReport,
        unknownFeatureReport,
      ],
      expectedPrintedReport: nonDefaultRulesPrintedReport,
      overrideRules: {
        compatible: 'fail',
        'partial-support': 'fail',
        flagged: 'warn',
        unknown: 'pass',
        'unknown-feature': 'pass',
        incompatible: 'warn',
      },
    },
  ],
  [
    'explicitly excluded per-feature summaries',
    {
      compatibilityReports: [unknownFeatureReport],
      expectedPrintedReport: excludedPerFeatureSummariesPrintedReport,
      includePerFeatureSummary: false,
    },
  ],
];

test.each<[string, TestData]>(testCases)(
  'prints expected report for case: %s',
  (
    _,
    {
      compatibilityReports,
      expectedPrintedReport,
      overrideRules,
      includePerFeatureSummary,
    },
  ) => {
    const loggedLines: string[] = [];
    jest
      .spyOn(global.console, 'log')
      .mockImplementation((message) => loggedLines.push(message));

    const overallResult = getOverallStatus(compatibilityReports);
    printCompatibilityReports({
      reports: compatibilityReports,
      overallResult,
      rules: overrideRules ?? DEFAULT_RULES,
      includePerFeatureSummary: includePerFeatureSummary ?? true,
    });

    expect(loggedLines.join('\n')).toEqual(expectedPrintedReport);
  },
);
