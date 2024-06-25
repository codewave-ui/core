import { BasePage, Element } from '../element/index.js';
import { SelectorFactory } from '../element/selector/factory.selector.js';
import { SelectorElement } from '../type/index.js';

export function FindElement(selectors: SelectorElement[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    return function (this: BasePage) {
      const defaultSelector = this.config.defaultSelector;
      const filteredSelectorWithDefaultSelector = selectors.filter(
        selector => selector.name === defaultSelector,
      );
      const isDefaultSelectorExist = filteredSelectorWithDefaultSelector.length > 0;
      const finalSelectorList = isDefaultSelectorExist
        ? selectors.filter(selector => selector.name !== defaultSelector)
        : selectors.slice(1);

      return new Element(
        finalSelectorList.map(selector =>
          SelectorFactory.createSelector(
            selector.name,
            selector.value,
            Object.entries(selector)
              .filter(val => val[0] !== 'name' && val[0] !== 'value')
              .map(val => val[1]),
          ),
        ),
        filteredSelectorWithDefaultSelector.length > 0
          ? SelectorFactory.createSelector(
              filteredSelectorWithDefaultSelector[0].name,
              filteredSelectorWithDefaultSelector[0].value,
              ...Object.entries(filteredSelectorWithDefaultSelector[0])
                .filter(val => val[0] !== 'name' && val[0] !== 'value')
                .map(val => val[1]),
            )
          : SelectorFactory.createSelector(
              selectors[0].name,
              selectors[0].value,
              ...Object.entries(selectors[0])
                .filter(val => val[0] !== 'name' && val[0] !== 'value')
                .map(val => val[1]),
            ),
      );
    };
  };
}
