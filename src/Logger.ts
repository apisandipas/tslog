// import { LogLevel } from './LogLevel';
import { Adapter } from './Adapter';
import { ConsoleAdapter } from './ConsoleAdapter';
import { LogEntry, MsgType } from './Adapter';
import { LogLevel } from './LogLevel';

type LoggerConfig = {
  logLevel?: LogLevel;
  sampleRate?: number;
  adapters?: Adapter[];
};

class Logger {
  public logLevel: LogLevel;
  private sampleRate: number;
  private adapters: Adapter[];

  constructor(config?: LoggerConfig | undefined) {
    this.logLevel = config?.logLevel || LogLevel.Trace;
    this.sampleRate = config?.sampleRate || 100;
    this.adapters = config?.adapters || [new ConsoleAdapter()];
  }

  public log(logLevel: LogLevel, msg: MsgType, ...additional: any[]): void {
    if (logLevel < this.logLevel) return;

    if (Math.random() * 100 < this.sampleRate) {
      this._log(logLevel, msg, ...additional);
    }
  }

  public trace(msg: MsgType, ...additional: any[]): void {
    this.log(LogLevel.Trace, msg, ...additional);
  }

  public debug(msg: MsgType, ...additional: any[]): void {
    this.log(LogLevel.Debug, msg, ...additional);
  }

  public info(msg: MsgType, ...additional: any[]): void {
    this.log(LogLevel.Info, msg, ...additional);
  }

  public warn(msg: MsgType, ...additional: any[]): void {
    this.log(LogLevel.Warn, msg, ...additional);
  }

  public error(msg: MsgType, ...additional: any[]): void {
    this.log(LogLevel.Error, msg, ...additional);
  }

  public fatal(msg: MsgType, ...additional: any[]): void {
    this.log(LogLevel.Fatal, msg, ...additional);
  }

  private _log(logLevel: LogLevel, msg: MsgType, ...additional: any[]): void {
    let msgOutput;
    if (typeof msg === 'object') {
      try {
        msgOutput = '\r\n';
        msgOutput += JSON.stringify(msg, null, 2);
        msgOutput += '\r\n';
      } catch (e) {
        additional = [msg, ...additional];
        msgOutput = ' 👻 circular object in msg param... ';
      }
    }

    const logEntry = {
      logLevel,
      msg: msgOutput || msg,
      timestamp: new Date(),
      additional
    } as LogEntry;

    if (this.adapters.length > 0) {
      this.adapters.forEach(adapter => adapter.log(logEntry));
    }
  }
}

export { Logger };
