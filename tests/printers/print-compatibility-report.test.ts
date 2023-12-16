import { getOverallStatus } from '../../src/report-generators/get-overall-status';
import { printCompatibilityReports } from '../../src/printers';
import { CompatibilityReport } from '../../src/types/compatibility';
import {
  compatibleReport,
  emptyReport,
  flaggedCompatibilityReport,
  flaggedCompatibilityReportWithLongFeatureId,
  flaggedCompatibilityReportWithManyBrowsers,
  partiallyCompatibleReport,
  unknownFeatureReport,
} from '../test-data/compatibility-reports';
import {
  emptyPrintedReport,
  longFeatureIdPrintedReport,
  manyBrowsersPrintedReport,
  multipleFilesPrintedReport,
  oneCompatibleFilePrintedReport,
  oneFileWithUnknownFeaturePrintedReport,
} from './expected-printed-reports';

type TestData = {
  compatibilityReports: CompatibilityReport[];
  expectedPrintedReport: string;
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
];

test.each<[string, TestData]>(testCases)(
  'prints expected report for case: %s',
  (_, { compatibilityReports, expectedPrintedReport }) => {
    const loggedLines: string[] = [];
    jest
      .spyOn(global.console, 'log')
      .mockImplementation((message) => loggedLines.push(message));

    const overallStatus = getOverallStatus(compatibilityReports);
    printCompatibilityReports(compatibilityReports, overallStatus);

    expect(loggedLines.join('\n')).toEqual(expectedPrintedReport);
  },
);
