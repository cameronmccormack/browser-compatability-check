import fs from 'fs';
import jsonfile from 'jsonfile';
import { writeCompatibilityReportFiles } from '../../src/report-writers/report-writer';
import {
  compatibleOverallReport,
  customRulesOverallReport,
  failedOverallReport,
  multipleReportsOverallReport,
  partiallyCompatibleOverallReport,
  summaryOnlyOverallReport,
  unknownFeatureOverallReport,
} from '../test-data/overall-reports';
import { OutputReportFile } from '../../src/types/report-options';
import { OverallReport } from '../../src/types/compatibility';

afterEach(() => jest.restoreAllMocks());

describe('unit tests', () => {
  test('creates the expected number and type of reports', () => {
    const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockReturnValue();
    const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockReturnValue(undefined);
    const copyFileSyncSpy = jest.spyOn(fs, 'copyFileSync').mockReturnValue();
    const jsonfileWriteSpy = jest
      .spyOn(jsonfile, 'writeFileSync')
      .mockReturnValue();

    const fileSpecs: OutputReportFile[] = [
      { type: 'json', location: 'example/path1/file.json' },
      { type: 'json', location: 'example/path2/file.json' },
      { type: 'html', location: 'example/path3/file.html' },
      { type: 'json', location: 'example/path4/file.json' },
    ];

    writeCompatibilityReportFiles(compatibleOverallReport, fileSpecs);

    fileSpecs.forEach((spec) => {
      const outputDirectory = spec.location.split('/').slice(0, -1).join('/');

      if (spec.type === 'html') {
        expect(mkdirSyncSpy).toHaveBeenCalledWith(`${outputDirectory}/static`);
        expect(copyFileSyncSpy).toHaveBeenCalledWith(
          'images/logo-text.svg',
          `${outputDirectory}/static/logo.svg`,
        );
        expect(writeFileSyncSpy).toHaveBeenCalledWith(
          spec.location,
          expect.any(String),
        );
      }

      if (spec.type === 'json') {
        expect(jsonfileWriteSpy).toHaveBeenCalledWith(
          spec.location,
          compatibleOverallReport,
          { spaces: 2 },
        );
      }
    });
  });
});

const snapshotTestCases: [string, OverallReport][] = [
  ['compatible report', compatibleOverallReport],
  ['partially compatible report', partiallyCompatibleOverallReport],
  ['failed report', failedOverallReport],
  ['unknown feature report', unknownFeatureOverallReport],
  ['custom rules report', customRulesOverallReport],
  ['summary only report', summaryOnlyOverallReport],
  ['multiple CSS files report', multipleReportsOverallReport],
];

describe('HTML report snapshot tests', () => {
  test.each<[string, OverallReport]>(snapshotTestCases)(
    'creates the expected HTML report for the case: %s',
    (_, overallReport) => {
      let htmlReport: string = 'to be updated';

      jest.spyOn(fs, 'writeFileSync').mockImplementationOnce((_, data) => {
        htmlReport = data as string;
      });
      jest.spyOn(fs, 'mkdirSync').mockReturnValue(undefined);
      jest.spyOn(fs, 'copyFileSync').mockReturnValue();

      writeCompatibilityReportFiles(overallReport, [
        { location: 'example.html', type: 'html' },
      ]);

      expect(htmlReport).toMatchSnapshot();
    },
  );
});
