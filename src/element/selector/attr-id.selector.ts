import { AttrIdSelectorElement } from '../../type/index.js';
import { BaseSelector } from './base.selector.js';

export class AttrIdSelectorElementImpl extends BaseSelector implements AttrIdSelectorElement {
  constructor(value: string) {
    super(value);
  }

  get name() {
    return 'attr:id' as const;
  }

  convertToWdioSelector(): string {
    return `#${this._value}`;
  }

  toString(): string {
    return `[${super.toString()} [wdio --> ${this.convertToWdioSelector()}]]`;
  }
}
