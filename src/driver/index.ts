import { remote } from 'webdriverio';
import { Config } from '../config/index.js';
import { Logger } from '../logger/index.js';

export class Driver {
  private logger: Logger;
  private config: Config;
  private driverInstance: WebdriverIO.Browser | undefined;

  constructor(config: Config, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async destroyDriver(): Promise<void> {
    if (this.driverInstance) {
      await this.driverInstance.deleteSession();
      this.driverInstance = undefined;
    } else {
      throw new Error(
        '[ERR1001] Driver session has been closed. Probably the driver has been crashed or you forgot to initialize it in the first place.',
      );
    }
  }

  async startDriver(): Promise<WebdriverIO.Browser> {
    if (this.driverInstance) {
      this.logger.warn(
        'Previous driver session exist. If you want to create new session consider closing previous session by using "destroyDriver()" function. Re-using previous driver instance...',
      );
      return this.driverInstance;
    } else {
      this.logger.info('Initializing driver...');
      const newDriver = await remote({
        capabilities: this.config.desiredCapabilities,
        logLevel: this.config.logLevel,
        connectionRetryCount: this.config.connectionRetryCount,
        connectionRetryTimeout: this.config.connectionRetryTimeout,
        waitforInterval: this.config.waitForInterval,
        waitforTimeout: this.config.waitForTimeout,
        protocol: this.config.server?.protocol,
        hostname: this.config.server?.host,
        port: this.config.server?.port,
        path: this.config.server?.path,
      });
      this.driverInstance = newDriver;
      this.logger.info('Driver initialization completed!');

      return newDriver;
    }
  }

  public getDriverInstance() {
    return this.driverInstance;
  }
}
