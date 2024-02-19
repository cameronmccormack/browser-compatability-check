import chalk, { Chalk } from 'chalk';
import { OverallResult } from '../../types/overall-result';

export const CHALK_STYLES = {
  pass: {
    high: chalk.bgGreen.bold,
    low: chalk.green,
  },
  warn: {
    high: chalk.bgYellow.bold,
    low: chalk.yellow,
  },
  fail: {
    high: chalk.bgRed.bold,
    low: chalk.red,
  },
};

export const applyChalkStyles = (text: string, styles?: Chalk): string => {
  if (!styles) {
    return text;
  }

  const unpaddedText = text.trim();
  return text.replace(unpaddedText, styles(unpaddedText));
};

export const getChalkStylesForStatus = (
  status: OverallResult,
  emphasis: 'high' | 'low' = 'low',
): Chalk => CHALK_STYLES[status][emphasis];

export const getStyledOverallStatus = (status: OverallResult): string =>
  getChalkStylesForStatus(status, 'high')(status.toUpperCase());
