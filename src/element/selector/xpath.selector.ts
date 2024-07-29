import { XpathSelectorElement } from '../index.js';
import { BaseSelector } from './base.selector.js';

export class XpathSelectorElementImpl extends BaseSelector implements XpathSelectorElement {
  constructor(value: string) {
    super(value);
  }

  get name() {
    return 'xpath' as const;
  }

  convertToWdioSelector(): string {
    return this._value;
  }

  toString(): string {
    return `[${super.toString()}]`;
  }
}
