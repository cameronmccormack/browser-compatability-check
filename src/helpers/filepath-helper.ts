import * as fs from 'fs';

export const isValidFilepath = (filepath: string): boolean =>
  fs.existsSync(filepath);
