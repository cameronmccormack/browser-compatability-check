import { main } from '.';

enum ExitCode {
  Compatible = 0,
  Incompatible = 1,
  BadArgsOrException = 2,
}

export const runCli = (exitWith: (code: ExitCode) => ExitCode): ExitCode => {
  main();

  return exitWith(0);
};
