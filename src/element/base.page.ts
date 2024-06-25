import { BaseConfig } from '../config/index.js';

export class BasePage {
  protected config: BaseConfig;

  constructor(config: BaseConfig) {
    this.config = config;
  }
  
  url() {
    return 'https://google.com';
  }
}
