export class AssertionError extends Error {
  constructor(assertionName: string, actual: string, expected: string) {
    super(
      `Failed to assert from '${assertionName}'. Expected result: '${expected}' while actual result: '${actual}'`,
    );
  }
}
