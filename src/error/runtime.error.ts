import { BaseSelector } from '../element/index.js';

export class RuntimeError extends Error {
  constructor(errCode: string, message: string, selector: BaseSelector) {
    super(`[${errCode}] ${message} ${selector.toString()}`);
  }
}
