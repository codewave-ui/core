export class InvalidArgumentError extends Error {
  constructor(argName: string, expected: string, given: string) {
    super(
      `[ERR2002] Invalid argument given! Name: ${argName}; Expected to be: ${expected}; Given: ${given}`,
    );
  }
}
