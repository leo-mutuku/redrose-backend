import { createLogger, format, transports } from "winston";

const logger = createLogger({
    level: "error",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.errors({ stack: true }),
        format.json()
    ),
    transports: [
        new transports.File({ filename: "logs/error.log", level: "error" }), // Log errors to file
        new transports.Console({ format: format.simple() }), // Optionally log to console
    ],
});

export default logger;
