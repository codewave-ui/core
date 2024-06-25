import { BaseConfig } from '../config/index.js';
import { BaseKeyword } from '../keyword/index.js';
import { Logger } from '../logger/index.js';
import { Runner } from '../runner/index.js';
import { Driver } from '../type/index.js';

export abstract class BaseDriver implements Driver {
  protected _logger: Logger;
  protected _keywordLogger: Logger;
  protected _config: BaseConfig;
  protected _runner: Runner;

  constructor(config: BaseConfig, logger: Logger, keywordLogger: Logger, runner: Runner) {
    this._config = config;
    this._logger = logger;
    this._keywordLogger = keywordLogger;
    this._runner = runner;
  }

  protected _driver!: WebdriverIO.Browser;

  get driver(): WebdriverIO.Browser {
    return this._driver;
  }

  protected _keyword!: BaseKeyword;

  get keyword(): BaseKeyword {
    return this._keyword;
  }

  abstract destroyDriver(): Promise<void>;

  abstract startDriver(): Promise<WebdriverIO.Browser>;
}
