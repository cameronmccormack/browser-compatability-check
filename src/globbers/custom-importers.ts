export const sassTildeCustomImporter = {
  findFileUrl: (url: string): URL | null =>
    url.startsWith('~')
      ? new URL(`file://${process.cwd()}/node_modules/${url.substring(1)}`)
      : null,
};
