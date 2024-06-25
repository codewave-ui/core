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

export type SelectorElement =
  | AttrIdSelectorElement
  | TextSelectorElement
  | TagSelectorElement
  | XpathSelectorElement;
