/* eslint-disable no-console */
import { Chalk } from 'chalk';
import { applyChalkStyles } from './chalk-helper';

export const printSingleColumnTableDivider = (width: number): void => {
  console.log(`|${'-'.repeat(width - 2)}|`);
};

export const printSingleColumnTableSpacer = (
  width: number,
  edgeCharacter: string = '|',
): void => {
  console.log(`${edgeCharacter}${' '.repeat(width - 2)}${edgeCharacter}`);
};

export const printFullWidthCharacterRow = (
  character: string,
  width: number,
): void => {
  console.log(character.repeat(width));
};

export const printFullWidthRowWithText = (
  text: string,
  width: number,
  {
    edgeCharacter = '|',
    justification = 'center',
  }: { edgeCharacter?: string; justification?: 'left' | 'center' } = {
    edgeCharacter: '|',
    justification: 'center',
  },
  styles?: Chalk,
): void => {
  switch (justification) {
    case 'center':
      printFullWidthRowWithCenteredText(text, width, edgeCharacter, styles);
      break;
    case 'left':
      printFullWidthRowWithLeftAlignedText(text, width, edgeCharacter, styles);
  }
};

const printFullWidthRowWithCenteredText = (
  text: string,
  width: number,
  edgeCharacter: string,
  styles?: Chalk,
): void => {
  const widthExcludingEdges = width - 2;
  const paddedText = text
    .padStart((text.length + widthExcludingEdges) / 2)
    .padEnd(widthExcludingEdges);
  console.log(
    `${edgeCharacter}${applyChalkStyles(paddedText, styles)}${edgeCharacter}`,
  );
};

const printFullWidthRowWithLeftAlignedText = (
  text: string,
  width: number,
  edgeCharacter: string,
  styles?: Chalk,
): void => {
  const paddedText = text.padEnd(width - 3);
  console.log(
    `${edgeCharacter} ${applyChalkStyles(paddedText, styles)}${edgeCharacter}`,
  );
};
