import { Config } from '../config/index.js';

export class BasePage {
  protected config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  url(): string {
    throw new Error("[ERR4002] Method 'BasePage.url()' not implemented yet!");
  }
}
