function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

let LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["Trace"] = 10] = "Trace";
  LogLevel[LogLevel["Debug"] = 20] = "Debug";
  LogLevel[LogLevel["Info"] = 30] = "Info";
  LogLevel[LogLevel["Warn"] = 40] = "Warn";
  LogLevel[LogLevel["Error"] = 50] = "Error";
  LogLevel[LogLevel["Fatal"] = 60] = "Fatal";
})(LogLevel || (LogLevel = {}));

class ConsoleAdapter {
  constructor(forceIe = false) {
    _defineProperty(this, "isIE", void 0);

    this.isIE = forceIe || navigator.appName === 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv:11/));
  }

  log(entry) {
    const prefix = this.getPrefix(entry.timestamp, entry.logLevel);

    if (this.isIE) {
      this.logIE(prefix, entry.logLevel, entry.msg, entry.additional);
    } else {
      const color = this.getColor(entry.logLevel);
      console.log(`%c  ${prefix}`, `color:${color}; background-color: #282c34; padding: 0.5rem; font-family: sans-serif; `, entry.msg, ...entry.additional);
    }
  }

  logIE(prefix, logLevel, msg, additional) {
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

  getPrefix(timestamp, logLevel) {
    return `${timestamp.toISOString()} [${LogLevel[logLevel].toUpperCase()}]`;
  }

  getColor(logLevel) {
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

console.log('foo');

class Logger {
  constructor(config) {
    _defineProperty(this, "logLevel", void 0);

    _defineProperty(this, "sampleRate", void 0);

    _defineProperty(this, "adapters", void 0);

    this.logLevel = (config === null || config === void 0 ? void 0 : config.logLevel) || LogLevel.Trace;
    this.sampleRate = (config === null || config === void 0 ? void 0 : config.sampleRate) || 100;
    this.adapters = (config === null || config === void 0 ? void 0 : config.adapters) || [new ConsoleAdapter()];
  }

  log(logLevel, msg, ...additional) {
    if (logLevel < this.logLevel) return;

    if (Math.random() * 100 < this.sampleRate) {
      this._log(logLevel, msg, ...additional);
    }
  }

  trace(msg, ...additional) {
    this.log(LogLevel.Trace, msg, ...additional);
  }

  debug(msg, ...additional) {
    this.log(LogLevel.Debug, msg, ...additional);
  }

  info(msg, ...additional) {
    this.log(LogLevel.Info, msg, ...additional);
  }

  warn(msg, ...additional) {
    this.log(LogLevel.Warn, msg, ...additional);
  }

  error(msg, ...additional) {
    this.log(LogLevel.Error, msg, ...additional);
  }

  fatal(msg, ...additional) {
    this.log(LogLevel.Fatal, msg, ...additional);
  }

  _log(logLevel, msg, ...additional) {
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
    };

    if (this.adapters.length > 0) {
      this.adapters.forEach(adapter => adapter.log(logEntry));
    }
  }

}

export { ConsoleAdapter, LogLevel, Logger };
