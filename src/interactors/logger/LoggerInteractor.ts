// src/infrastructure/logging/WinstonLogger.ts
import { ILoggerInteractor } from "../../interfaces/logger/LoggerInterface";
import { createLogger, format, Logger, transports } from "winston";

export class WinstonLogger implements ILoggerInteractor {
    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""
                        }`;
                })
            ),
            transports: [
                new transports.File({ filename: "logs/errors.log", level: "error" }),
                new transports.File({ filename: "logs/combined.log" }),
                new transports.Console(),
            ],
        });
    }

    error(message: string, meta?: any): void {
        this.logger.error(message, meta);
    }

    info(message: string, meta?: any): void {
        this.logger.info(message, meta);
    }
}
