import { getOverallStatus } from '../../src/report-generators/get-overall-status';
import { printCompatibilityReports } from '../../src/printers';
import { CompatibilityReport } from '../../src/types/compatibility';
import {
  compatibleReport,
  compatibleReportWithParsingErrors,
  emptyReport,
  flaggedCompatibilityReport,
  flaggedCompatibilityReportWithLongFeatureId,
  flaggedCompatibilityReportWithManyBrowsers,
  incompatibleReport,
  partiallyCompatibleReport,
  unknownFeatureReport,
} from '../test-data/compatibility-reports';
import { DEFAULT_RULES } from '../../src/run-commands/default-rules';
import { Rules } from '../../src/types/rules';

type TestData = {
  compatibilityReports: CompatibilityReport[];
  overrideRules?: Rules;
  includePerFeatureSummary?: boolean;
};

const testCases: [string, TestData][] = [
  [
    'one compatible report',
    {
      compatibilityReports: [compatibleReport],
    },
  ],
  [
    'one report with unknown feature',
    {
      compatibilityReports: [unknownFeatureReport],
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
    },
  ],
  [
    '>3 browsers report',
    {
      compatibilityReports: [flaggedCompatibilityReportWithManyBrowsers],
    },
  ],
  [
    'very long CSS identifier report',
    {
      compatibilityReports: [flaggedCompatibilityReportWithLongFeatureId],
    },
  ],
  [
    'empty report',
    {
      compatibilityReports: [emptyReport],
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
      includePerFeatureSummary: false,
    },
  ],
  [
    'css parsing errors',
    {
      compatibilityReports: [compatibleReportWithParsingErrors],
      includePerFeatureSummary: false,
    },
  ],
];

test.each<[string, TestData]>(testCases)(
  'prints expected report for case: %s',
  (_, { compatibilityReports, overrideRules, includePerFeatureSummary }) => {
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

    expect(loggedLines.join('\n')).toMatchSnapshot();
  },
);
