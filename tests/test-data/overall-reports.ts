import { DEFAULT_RULES } from '../../src/run-commands/default-rules';
import { OverallReport } from '../../src/types/compatibility';
import {
  compatibleReport,
  incompatibleReport,
  partiallyCompatibleReport,
  unknownFeatureReport,
} from './compatibility-reports';

export const compatibleOverallReport: OverallReport = {
  overallResult: 'pass',
  reports: [compatibleReport],
  includePerFeatureSummary: true,
  rules: DEFAULT_RULES,
};

export const partiallyCompatibleOverallReport: OverallReport = {
  overallResult: 'warn',
  reports: [partiallyCompatibleReport],
  includePerFeatureSummary: true,
  rules: DEFAULT_RULES,
};

export const failedOverallReport: OverallReport = {
  overallResult: 'warn',
  reports: [incompatibleReport],
  includePerFeatureSummary: true,
  rules: DEFAULT_RULES,
};

export const unknownFeatureOverallReport: OverallReport = {
  overallResult: 'warn',
  reports: [unknownFeatureReport],
  includePerFeatureSummary: true,
  rules: DEFAULT_RULES,
};

export const customRulesOverallReport: OverallReport = {
  overallResult: 'fail',
  reports: [compatibleReport],
  includePerFeatureSummary: true,
  rules: {
    ...DEFAULT_RULES,
    compatible: 'fail',
  },
};

export const summaryOnlyOverallReport: OverallReport = {
  overallResult: 'pass',
  reports: [compatibleReport],
  includePerFeatureSummary: false,
  rules: DEFAULT_RULES,
};

export const multipleReportsOverallReport: OverallReport = {
  overallResult: 'pass',
  reports: [compatibleReport, compatibleReport, compatibleReport],
  includePerFeatureSummary: true,
  rules: DEFAULT_RULES,
};
