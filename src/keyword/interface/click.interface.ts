import { Element } from '../../element/index.js';

export type ClickInterface = {
  click(element: Element): Promise<void>;
}
