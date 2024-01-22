export type ReportOptions = {
  includePerFeatureSummary: boolean;
  outputReportFiles: OutputReportFile[];
};

export type OutputReportFile = {
  type: 'json' | 'html';
  location: string;
};
