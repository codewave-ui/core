/* eslint-disable @typescript-eslint/no-explicit-any */
type ConstructorParameters<T> = T extends {
  new (a: any, b: any, c: any, ...args: infer P): any;
}
  ? P
  : never;

export class RunnerListener<T extends abstract new (...args: any) => any> {
  public readonly implClass: T;
  public readonly args?: ConstructorParameters<T>;

  constructor(implClass: T, ...args: ConstructorParameters<T>) {
    this.implClass = implClass;
    this.args = args;
  }
}
