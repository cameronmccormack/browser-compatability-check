export type ReportOptions = {
  includePerFeatureSummary: boolean;
  outputReportFiles: OutputReportFile[];
};

type OutputReportFile = {
  type: 'txt' | 'json' | 'html';
  location: string;
};
