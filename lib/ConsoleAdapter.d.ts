import { Adapter, LogEntry } from './Adapter';
export declare class ConsoleAdapter implements Adapter {
    private isIE;
    constructor(forceIe?: boolean);
    log(entry: LogEntry): void;
    private logIE;
    private getPrefix;
    private getColor;
}
