import { TagSelectorElement } from '../../type/index.js';
import { BaseSelector } from './base.selector.js';

export class TagSelectorElementImpl extends BaseSelector implements TagSelectorElement {
  constructor(value: string) {
    super(value);
  }

  get name() {
    return 'tag' as const;
  }

  convertToWdioSelector(): string {
    return `<${this._value} />`;
  }

  toString(): string {
    return `[${super.toString()} [wdio --> ${this.convertToWdioSelector()}]]`;
  }
}
