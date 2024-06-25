import { remote } from 'webdriverio';
import { DesktopConfigs } from '../config/index.js';
import { WebKeyword } from '../keyword/index.js';
import { Driver } from '../type/index.js';
import { BaseDriver } from './base.driver.js';

export class WebDriver extends BaseDriver implements Driver {
  async destroyDriver(): Promise<void> {
    await this.driver.deleteSession();
  }

  async startDriver(): Promise<WebdriverIO.Browser> {
    const config = this._config as DesktopConfigs;
    this._logger.info('Starting web driver...');
    const newDriver = await remote({
      capabilities: {
        browserName: config.browserName,
        browserVersion: config.browserVersion,
        ...config.desiredCapabilities,
      },
      logLevel: config.logLevel,
      connectionRetryCount: config.connectionRetryCount,
      connectionRetryTimeout: config.connectionRetryTimeout,
      waitforInterval: config.waitForInterval,
      waitforTimeout: config.waitForTimeout,
      protocol: config.server?.protocol,
      hostname: config.server?.host,
      port: config.server?.port,
      path: config.server?.path,
    });
    this._driver = newDriver;
    this._logger.info('Web driver initialization completed!');
    this._keyword = new WebKeyword(newDriver, this._runner, this._keywordLogger, this._config);
    return newDriver;
  }
}
