import { CompatibilityReport } from '../types/compatibility';
import { OverallResult } from '../types/overall-result';

export const getOverallStatus = (
  reports: CompatibilityReport[],
): OverallResult => {
  if (reports.some((report) => report.overallStatus === 'fail')) {
    return 'fail';
  }

  if (reports.some((report) => report.overallStatus === 'warn')) {
    return 'warn';
  }

  return 'pass';
};
