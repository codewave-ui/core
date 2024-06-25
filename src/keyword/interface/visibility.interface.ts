import { Element } from '../../element/index.js';

export type VisibilityInterface = {
  verifyElementVisible(element: Element): Promise<void>;
  verifyElementNotVisible(element: Element): Promise<void>;
  waitForElementVisible(element: Element, timeout?: number): Promise<boolean>;
  waitForElementNotVisible(element: Element, timeout?: number): Promise<boolean>;
};
