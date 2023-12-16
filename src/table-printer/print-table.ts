/* eslint-disable no-console */
type ValueCellsForRow = Record<string, string | number | boolean>;

interface Row<Columns extends ValueCellsForRow> {
  indexValue: string;
  otherValues: Columns;
}

interface ColumnWidths<Columns extends ValueCellsForRow> {
  indexWidth: number;
  otherWidths: { [key in keyof Columns]: number };
}

interface TableData<Columns extends ValueCellsForRow> {
  rows: Row<Columns>[];
}

const getCenterPaddedString = (
  originalString: string,
  length: number,
): string =>
  originalString
    .padStart(
      originalString.length + Math.ceil((length - originalString.length) / 2),
    )
    .padEnd(length);

const getDisplayString = (
  data: string,
  length: number,
  alignment: 'left' | 'right' | 'center' = 'left',
): string => {
  if (` ${data} `.length > length && data.length > 5) {
    return ` ...${data.slice(-length + 5)} `;
  }

  switch (alignment) {
    case 'left':
      return ` ${data} `.slice(-length).padEnd(length);
    case 'right':
      return ` ${data} `.slice(-length).padStart(length);
    case 'center':
      return getCenterPaddedString(data, length);
  }
};

const printDivider = <Columns extends ValueCellsForRow>(
  columnWidths: ColumnWidths<Columns>,
): void => {
  const columnHorizontals = [
    '-'.repeat(columnWidths.indexWidth),
    ...Object.values(columnWidths.otherWidths).map((width) =>
      '-'.repeat(width),
    ),
  ];
  console.log(`|${columnHorizontals.join('|')}|`);
};

const printColumnHeadings = <Columns extends ValueCellsForRow>(
  columnWidths: ColumnWidths<Columns>,
): void => {
  const indexHeading = getDisplayString('Index', columnWidths.indexWidth);
  const otherHeadings = Object.entries(columnWidths.otherWidths).map(
    ([heading, width]) => getDisplayString(heading, width, 'center'),
  );
  console.log(`|${[indexHeading, ...otherHeadings].join('|')}|`);
};

const printRow = <Columns extends ValueCellsForRow>(
  row: Row<Columns>,
  columnWidths: ColumnWidths<Columns>,
): void => {
  const indexCell = getDisplayString(row.indexValue, columnWidths.indexWidth);
  const otherCells = Object.entries(row.otherValues).map(([key, value]) =>
    getDisplayString(value.toString(), columnWidths.otherWidths[key], 'center'),
  );
  const allCells = [indexCell, ...otherCells];
  console.log(`|${allCells.join('|')}|`);
};

const getColumnWidths = <Columns extends ValueCellsForRow>(
  data: TableData<Columns>,
  characterWidth: number,
): ColumnWidths<Columns> => {
  const maxLengths: { [x: string]: number } = {};
  // add 2 to account for space on each side
  let maxIndexLength = 'Index'.length + 2;
  data.rows.forEach((row) => {
    // add 2 to account for space on each side
    const indexLength = row.indexValue.length + 2;
    if (indexLength > maxIndexLength) {
      maxIndexLength = indexLength;
    }
    Object.entries(row.otherValues).forEach(([key, value]) => {
      // add 2 to account for space on each side
      const length = Math.max(value.toString().length, key.length) + 2;
      if (!(key in maxLengths) || length > maxLengths[key]) {
        maxLengths[key] = length;
      }
    });
  });

  const numberOfDividers = 2 + Object.keys(maxLengths).length;
  const remainingCharacters = characterWidth - numberOfDividers;

  const totalWidth =
    Object.values(maxLengths).reduce((a, b) => a + b, 0) + maxIndexLength;
  if (totalWidth > remainingCharacters) {
    return {
      indexWidth: maxIndexLength - totalWidth + remainingCharacters,
      otherWidths: maxLengths as { [key in keyof Columns]: number },
    };
  }

  const widthToAllocate = remainingCharacters - totalWidth;

  return {
    indexWidth: maxIndexLength + widthToAllocate,
    otherWidths: maxLengths as { [key in keyof Columns]: number },
  };
};

const getFormattedTable = <Columns extends ValueCellsForRow>(
  rawData: Record<string, Columns>,
): TableData<Columns> => {
  return {
    rows: Object.entries(rawData).map(([key, value]) => ({
      indexValue: key,
      otherValues: value,
    })),
  };
};

const printOverallHeading = (
  headingText: string,
  characterWidth: number,
): void => {
  console.log(`|${'-'.repeat(characterWidth - 2)}|`);
  console.log(`|${' '.repeat(characterWidth - 2)}|`);
  console.log(`|${getCenterPaddedString(headingText, characterWidth - 2)}|`);
  console.log(`|${' '.repeat(characterWidth - 2)}|`);
};

export const printTable = (
  data: Record<string, ValueCellsForRow>,
  {
    characterWidth,
    headingText,
  }: { characterWidth: number; headingText?: string },
): void => {
  const tableCells = getFormattedTable(data);
  const columnWidths = getColumnWidths(tableCells, characterWidth);

  if (headingText) {
    printOverallHeading(headingText, characterWidth);
  }
  printDivider(columnWidths);
  printColumnHeadings(columnWidths);
  printDivider(columnWidths);
  tableCells.rows.forEach((row) => printRow(row, columnWidths));
  printDivider(columnWidths);
};
