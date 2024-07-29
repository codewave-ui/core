import { BaseSelector } from './selector/base.selector.js';

export * from './element.js';
export * from './base.page.js';
export * from './selector/base.selector.js';
export * from './selector/attr-id.selector.js';
export * from './selector/tag.selector.js';
export * from './selector/text.selector.js';
export * from './selector/xpath.selector.js';

export type BaseSelectorElement = {
  name: string;
  value: string;
};

export type AttrIdSelectorElement = {
  name: 'attr:id';
} & BaseSelectorElement;

export type TextSelectorElement = {
  name: 'text';
  contains?: boolean;
} & BaseSelectorElement;

export type TagSelectorElement = {
  name: 'tag';
} & BaseSelectorElement;

export type XpathSelectorElement = {
  name: 'xpath';
} & BaseSelectorElement;

export type CustomSelectorElement = {
  name: 'custom';
  implClass: typeof BaseSelector;
} & BaseSelectorElement;

export type SelectorElement =
  | AttrIdSelectorElement
  | TextSelectorElement
  | TagSelectorElement
  | XpathSelectorElement
  | CustomSelectorElement;
