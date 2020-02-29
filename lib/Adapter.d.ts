import { LogLevel } from './LogLevel';
export declare type MsgType = string | object;
export declare type LogEntry = {
    logLevel: LogLevel;
    msg: MsgType;
    additional: any[];
    timestamp: Date;
};
export interface Adapter {
    log(data: LogEntry): void;
}
