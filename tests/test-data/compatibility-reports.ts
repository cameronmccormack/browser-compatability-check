import { produce } from 'immer';
import { CompatibilityReport } from '../../src/types/compatibility';

export const EXAMPLE_FILEPATH = 'example/filepath/eg-file.css';

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
