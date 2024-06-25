import { BaseSelector } from '../element/index.js';

export class RuntimeError extends Error {
  constructor(message: string, selector: BaseSelector) {
    super(`${message} ${selector.toString()}`);
  }
}
