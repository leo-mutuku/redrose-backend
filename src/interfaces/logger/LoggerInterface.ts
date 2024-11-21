// src/application/interfaces/Logger.ts
export interface ILoggerInteractor {
    error(message: string, meta?: any): void;
    info(message: string, meta?: any): void;
}
