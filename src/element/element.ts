import { BaseSelector } from './selector/base.selector.js';

export class Element {
  private readonly _selectors: BaseSelector[];
  private readonly _defaultSelector: BaseSelector;

  constructor(selectors: BaseSelector[], defaultSelector: BaseSelector) {
    this._selectors = selectors;
    this._defaultSelector = defaultSelector;
  }

  private _selfHealingSuggestion?: boolean;

  get selfHealingSuggestion(): boolean | undefined {
    return this._selfHealingSuggestion;
  }

  set selfHealingSuggestion(value: boolean) {
    this._selfHealingSuggestion = value;
  }

  private _selfHealingSelector?: BaseSelector;

  get selfHealingSelector(): BaseSelector | undefined {
    return this._selfHealingSelector;
  }

  set selfHealingSelector(value: BaseSelector) {
    this._selfHealingSelector = value;
  }

  get selectors(): BaseSelector[] {
    return this._selectors;
  }

  get defaultSelector(): BaseSelector {
    return this._defaultSelector;
  }

  toString() {
    return `Object(${this.constructor.name}): ${this._defaultSelector.convertToWdioSelector()}`;
  }
}
