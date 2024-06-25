import { TextSelectorElement } from '../../type/index.js';
import { BaseSelector } from './base.selector.js';

export class TextSelectorElementImpl extends BaseSelector implements TextSelectorElement {
  private readonly _contains: boolean;

  constructor(value: string, contains?: boolean) {
    super(value);
    this._contains = Boolean(contains);
  }

  get name() {
    return 'text' as const;
  }

  get contains(): boolean {
    return this._contains;
  }

  convertToWdioSelector(): string {
    return `${this._contains ? '.*=' : '='}${this._value}`;
  }
  
  toString(): string {
    return `[${super.toString()} [wdio --> ${this.convertToWdioSelector()}]]`;
  }
}
