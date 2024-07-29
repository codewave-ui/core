import { BasePage } from '../../element/index.js';

export type NavigationInterface = {
  goTo(target: string | BasePage): Promise<void>;
  back(): Promise<void>;
};
