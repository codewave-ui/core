import { Element } from '../../element/index.js';

export type TextInterface = {
  verifyElementText(element: Element, text: string, isRegex?: boolean): Promise<void>;
};
