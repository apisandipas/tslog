import { Adapter } from './Adapter';
import { MsgType } from './Adapter';
import { LogLevel } from './LogLevel';
declare type LoggerConfig = {
    logLevel?: LogLevel;
    sampleRate?: number;
    adapters?: Adapter[];
};
declare class Logger {
    logLevel: LogLevel;
    private sampleRate;
    private adapters;
    constructor(config?: LoggerConfig | undefined);
    log(logLevel: LogLevel, msg: MsgType, ...additional: any[]): void;
    trace(msg: MsgType, ...additional: any[]): void;
    debug(msg: MsgType, ...additional: any[]): void;
    info(msg: MsgType, ...additional: any[]): void;
    warn(msg: MsgType, ...additional: any[]): void;
    error(msg: MsgType, ...additional: any[]): void;
    fatal(msg: MsgType, ...additional: any[]): void;
    private _log;
}
export { Logger };
