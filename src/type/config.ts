export type ServerConfig = {
  host?: string;
  port?: number;
  path?: string;
  protocol?: string;
};

export type LogLevelConfig = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';
