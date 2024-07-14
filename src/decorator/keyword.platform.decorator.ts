import { Keyword } from '../keyword/index.js';

type KeywordPlatformConfig = {
  desktop?: boolean;
  lite?: boolean;
  android?: boolean;
  ios?: boolean;
};

export function Platform(config?: KeywordPlatformConfig) {
  return function (
    target: (this: Keyword, ...args: any[]) => Promise<any>,
    context: ClassMethodDecoratorContext<Keyword, (this: Keyword, ...args: any[]) => Promise<any>>,
  ) {
    async function replacementMethod(this: Keyword, ...args: any[]): Promise<any> {
      if (this.driver.getDriverInstance()) {
        // console.log(
        //   this.config.platform,
        //   this.config.platform.valueOf(),
        //   this.config.isDesktopPlatform(),
        //   config,
        //   this.config.isIosPlatform() && !config?.ios,
        //   this.config.isAndroidPlatform() && !config?.android,
        //   this.config.isDesktopPlatform() && !config?.desktop,
        //   this.config.isLitePlatform() && !config?.lite,
        // );
        if (
          (this.config.isIosPlatform() && !config?.ios) ||
          (this.config.isAndroidPlatform() && !config?.android) ||
          (this.config.isDesktopPlatform() && !config?.desktop) ||
          (this.config.isLitePlatform() && !config?.lite)
        ) {
          throw new Error(
            `[ERR2001] Failed to execute keyword "${context.name.toString()}"! Keyword can not run on '${this.config.platform}' platform.`,
          );
        }

        return await target.call(this, ...args);
      } else {
        throw new Error(
          '[ERR1002] Session is null! Probably because of crash or you are using keyword before initiating the driver session.',
        );
      }
    }

    return replacementMethod;
  };
}
