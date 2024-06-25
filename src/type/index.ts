// interface TestGlobal {
//     b: number;
// }
//
// declare namespace NodeJS {
//     interface Global extends TestGlobal {
//         test: string
//         Feature: () => string;
//     }
// }
//
// declare const Feature: () => number;

export * from './driver.js';
export * from './test.js';
export * from './config.js';
export * from './listener.js';
export * from './element.js';
