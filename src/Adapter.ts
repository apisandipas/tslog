import { LogLevel } from './LogLevel';

export type MsgType = string | object;

export type LogEntry = {
  logLevel: LogLevel;
  msg: MsgType;
  additional: any[];
  timestamp: Date;
};

export interface Adapter {
  log(data: LogEntry): void;
}
