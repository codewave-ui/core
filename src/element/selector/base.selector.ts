import { SelectorElement } from '../../type/index.js';

export abstract class BaseSelector {
  protected readonly _value: string;

  protected constructor(value: string) {
    this._value = value;
  }

  abstract get name(): SelectorElement['name'];

  get value() {
    return this._value;
  }

  public abstract convertToWdioSelector(): string;

  toString() {
    return `${this.name} --> ${this.value}`;
  }
}
