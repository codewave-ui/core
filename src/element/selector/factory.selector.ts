import { SelectorElement } from '../index.js';
import { AttrIdSelectorElementImpl } from './attr-id.selector.js';
import { TagSelectorElementImpl } from './tag.selector.js';
import { TextSelectorElementImpl } from './text.selector.js';
import { XpathSelectorElementImpl } from './xpath.selector.js';

export class SelectorFactory {
  static createSelector(name: SelectorElement['name'], value: string, ...args: any[]) {
    switch (name) {
      case 'text':
        if (args.length > 0) {
          if (typeof args[0] === 'boolean') {
            return new TextSelectorElementImpl(value, args[0]);
          } else {
            return new TextSelectorElementImpl(value);
          }
        } else {
          return new TextSelectorElementImpl(value);
        }
      case 'tag':
        return new TagSelectorElementImpl(value);
      case 'xpath':
        return new XpathSelectorElementImpl(value);
      case 'attr:id':
        return new AttrIdSelectorElementImpl(value);
      case 'custom':
        return new args[0](value);
    }
  }
}
