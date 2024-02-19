import { produce } from 'immer';
import { CompatibilityReport } from '../../src/types/compatibility';

export const EXAMPLE_FILEPATH = 'example/filepath/eg-file.css';

export const emptyReport: CompatibilityReport = {
  filePath: EXAMPLE_FILEPATH,
  overallStatus: 'pass',
  knownFeatures: {},
  unknownFeatures: [],
  browserSummaries: {},
  cssParsingErrors: [],
};

export const compatibleReport: CompatibilityReport = {
  filePath: EXAMPLE_FILEPATH,
  overallStatus: 'pass',
  knownFeatures: {
    'property:color:red': { chrome: { compatibility: 'compatible' } },
    'selector:last-child': { chrome: { compatibility: 'compatible' } },
    'at-rule:charset': { chrome: { compatibility: 'compatible' } },
    'function:calc': { chrome: { compatibility: 'compatible' } },
  },
  unknownFeatures: [],
  browserSummaries: {
    chrome: {
      compatible: 4,
      'partial-support': 0,
      flagged: 0,
      incompatible: 0,
      unknown: 0,
    },
  },
  cssParsingErrors: [],
};

export const partiallyCompatibleReport = produce(compatibleReport, (draft) => {
  draft.overallStatus = 'warn';
  draft.knownFeatures['property:color:red'].chrome.compatibility =
    'partial-support';
  draft.browserSummaries.chrome.compatible = 3;
  draft.browserSummaries.chrome['partial-support'] = 1;
});

export const flaggedCompatibilityReport = produce(compatibleReport, (draft) => {
  draft.overallStatus = 'warn';
  draft.knownFeatures['property:color:red'].chrome.compatibility = 'flagged';
  draft.browserSummaries.chrome.compatible = 3;
  draft.browserSummaries.chrome.flagged = 1;
});

export const flaggedCompatibilityReportWithOverallFailure = produce(
  flaggedCompatibilityReport,
  (draft) => {
    draft.overallStatus = 'fail';
  },
);

export const flaggedCompatibilityReportWithLongFeatureId = produce(
  flaggedCompatibilityReport,
  (draft) => {
    draft.knownFeatures[
      "property:example:very very very very long identifying value that will certainly be truncated as it's so extremely, extraordinarily, phenomenally long"
    ] = {
      chrome: { compatibility: 'compatible' },
    };
    draft.browserSummaries.chrome.compatible =
      flaggedCompatibilityReport.browserSummaries.chrome.compatible + 1;
  },
);

export const flaggedCompatibilityReportWithManyBrowsers = produce(
  flaggedCompatibilityReport,
  (draft) => {
    const knownFeatures = Object.keys(flaggedCompatibilityReport.knownFeatures);

    ['firefox', 'samsunginternet_android', 'safari', 'edge'].forEach(
      (browserSlug) => {
        knownFeatures.forEach((feature) => {
          draft.knownFeatures[feature][browserSlug] = {
            compatibility: 'compatible',
          };
        });
        draft.browserSummaries[browserSlug] = {
          compatible: knownFeatures.length,
          'partial-support': 0,
          flagged: 0,
          incompatible: 0,
          unknown: 0,
        };
      },
    );
  },
);

export const incompatibleReport = produce(compatibleReport, (draft) => {
  draft.overallStatus = 'fail';
  draft.knownFeatures['property:color:red'].chrome.compatibility =
    'incompatible';
  draft.browserSummaries.chrome.compatible = 3;
  draft.browserSummaries.chrome.incompatible = 1;
});

export const unknownCompatibilityReport = produce(compatibleReport, (draft) => {
  draft.overallStatus = 'warn';
  draft.knownFeatures['property:color:red'].chrome.compatibility = 'unknown';
  draft.browserSummaries.chrome.compatible = 3;
  draft.browserSummaries.chrome.unknown = 1;
});

export const unknownFeatureReport = produce(compatibleReport, (draft) => {
  draft.overallStatus = 'fail';
  draft.unknownFeatures = ['property:not-a-real-feature:20px'];
});
