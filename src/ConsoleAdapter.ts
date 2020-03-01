import { Adapter, LogEntry, MsgType } from './Adapter';
import { LogLevel } from './LogLevel';

export class ConsoleAdapter implements Adapter {
  private isIE: boolean;

  constructor(forceIe = false) {
    this.isIE =
      forceIe ||
      navigator.appName === 'Microsoft Internet Explorer' ||
      !!(
        navigator.userAgent.match(/Trident/) ||
        navigator.userAgent.match(/rv:11/)
      );
  }

  public log(entry: LogEntry): void {
    const prefix = this.getPrefix(entry.timestamp, entry.logLevel);

    if (this.isIE) {
      this.logIE(prefix, entry.logLevel, entry.msg, entry.additional);
    } else {
      const color = this.getColor(entry.logLevel);
      console.log(
        `%c  ${prefix}`,
        `color:${color}; background-color: #282c34; padding: 0.5rem; font-family: sans-serif; `,
        entry.msg,
        ...entry.additional
      );
    }
  }

  private logIE(
    prefix: string,
    logLevel: LogLevel,
    msg: MsgType,
    additional: any[]
  ): void {
    if (typeof console === 'undefined') return;

    switch (logLevel) {
      case LogLevel.Info:
        console.info(prefix, msg, ...additional);
        break;
      case LogLevel.Warn:
        console.warn(prefix, msg, ...additional);
        break;
      case LogLevel.Error:
        console.error(prefix, msg, ...additional);
        break;
      default:
        console.log(prefix, msg, ...additional);
        break;
    }
  }

  private getPrefix(timestamp: Date, logLevel: LogLevel): string {
    return `${timestamp.toISOString()} [${LogLevel[logLevel].toUpperCase()}]`;
  }

  private getColor(logLevel: LogLevel): string {
    switch (logLevel) {
      case LogLevel.Trace:
        return 'royalblue';
      case LogLevel.Debug:
        return 'aqua';
      case LogLevel.Info:
        return 'gray';
      case LogLevel.Warn:
        return 'yellow';
      case LogLevel.Error:
        return 'orange';
      case LogLevel.Fatal:
        return 'red';
    }
  }
}
