export type Driver = {
  startDriver(): Promise<WebdriverIO.Browser>;
  destroyDriver(): Promise<void>;
};
