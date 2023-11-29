import * as fs from 'fs';

export const getAllCssFiles = (absolutePath: string): string[] => {
  // TODO make this be useful
  const file = fs.readFileSync(
    `${absolutePath}/src/css-parser/example.css`,
    'utf8',
  );
  return [file];
};
