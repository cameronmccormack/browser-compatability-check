export const FILE_EXTENSIONS = ['css', 'sass', 'scss', 'less'] as const;

export type FileExtension = (typeof FILE_EXTENSIONS)[number];
