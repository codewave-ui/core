import { Logger } from '../logger/index.js';
import { BaseConfig, Platform } from './base.config.js';

export class DesktopConfigs extends BaseConfig {
  constructor(logger: Logger) {
    super(logger, Platform.WEB_DESKTOP);
    this._browserName = 'CHROME';
  }

  private _browserName: string;

  get browserName(): string {
    return this._browserName;
  }

  set browserName(value: string) {
    this._browserName = value;
  }

  private _browserVersion: string | undefined;

  get browserVersion(): string | undefined {
    return this._browserVersion;
  }

  set browserVersion(value: string | undefined) {
    this._browserVersion = value;
  }

  loadFromFile(path: string) {
    const temp = super.loadFromFile(path) as this;
    this.browserName = temp._browserName;
    this.browserVersion = temp._browserVersion;
    return temp;
  }
}
