/* eslint-disable no-console */

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
): void => {
  switch (justification) {
    case 'center':
      printFullWidthRowWithCenteredText(text, width, edgeCharacter);
      break;
    case 'left':
      printFullWidthRowWithLeftAlignedText(text, width, edgeCharacter);
  }
};

const printFullWidthRowWithCenteredText = (
  text: string,
  width: number,
  edgeCharacter: string,
): void => {
  const widthExcludingEdges = width - 2;
  console.log(
    `${edgeCharacter}${text
      .padStart((text.length + widthExcludingEdges) / 2)
      .padEnd(widthExcludingEdges)}${edgeCharacter}`,
  );
};

const printFullWidthRowWithLeftAlignedText = (
  text: string,
  width: number,
  edgeCharacter: string,
): void => {
  console.log(`${edgeCharacter} ${text.padEnd(width - 3)}${edgeCharacter}`);
};
