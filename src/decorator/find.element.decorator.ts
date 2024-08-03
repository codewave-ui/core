import { BasePage, Element, SelectorElement } from '../element/index.js';
import { SelectorFactory } from '../element/selector/factory.selector.js';

type platformSelectorConfig = {
  desktop?: SelectorElement[];
  lite?: SelectorElement[];
  android?: SelectorElement[];
  ios?: SelectorElement[];
};

export function FindElement(
  selectors: SelectorElement[] | platformSelectorConfig,
  config?: platformSelectorConfig,
) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    return function (this: BasePage) {
      const defaultSelector = this.config.defaultSelector;
      const platform = this.config.platform;
      const error = new Error(
        `Selector variable '${String(context.name)}' is not defined for platform '${this.config.platform}'!`,
      );
      let finalSelectors: SelectorElement[];

      if (Array.isArray(selectors)) {
        if (config && config[platform]) {
          if (config[platform].length > 0) {
            finalSelectors = config[platform];
          } else {
            throw error;
          }
        } else {
          if (selectors.length > 0) finalSelectors = selectors;
          else throw error;
        }
      } else {
        if (selectors[platform]) {
          if (selectors[platform].length > 0) {
            finalSelectors = selectors[platform];
          } else throw error;
        } else {
          throw error;
        }
      }

      const filteredSelectorWithDefaultSelector = finalSelectors.filter(
        selector => selector.name === defaultSelector,
      );
      const isDefaultSelectorExist = filteredSelectorWithDefaultSelector.length > 0;
      const finalSelectorList = isDefaultSelectorExist
        ? finalSelectors.filter(selector => selector.name !== defaultSelector)
        : finalSelectors.slice(1);

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
              finalSelectors[0].name,
              finalSelectors[0].value,
              ...Object.entries(finalSelectors[0])
                .filter(val => val[0] !== 'name' && val[0] !== 'value')
                .map(val => val[1]),
            ),
      );
    };
  };
}
