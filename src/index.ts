import "reflect-metadata";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler"; // Adjust path if necessary
import routers from "./routes";
import cors from "cors";
import { pgClient } from "./dbConnection";

const PORT = process.env.PORT || 9000;
const app = express();

// Middleware for parsing JSON requests
app.use(express.json());

// Security headers
app.use(helmet());

// Array of allowed origins
const allowedOrigins: string[] = [
  "http://localhost:80",
  "http://localhost",
  "http://localhost:5173",
  "http://localhost:9000",
  "http://192.168.88.234:8081",
  "http://192.168.88.234:8082",
  "http://192.168.88.234:9000",
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if origin is defined before comparing with allowedOrigins
      if (origin && allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else if (!origin) {
        // Allow requests with no origin (e.g., mobile apps, Postman)
        callback(null, true);
      } else {
        console.error(`Origin ${origin} not allowed by CORS`);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true, // Include credentials in requests if needed
  })
);


// Debugging middleware for logging CORS requests (optional)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Request from origin: ${req.headers.origin}`);
  next();
});

// Route handling
app.use("/api/v1", routers);

// Global error handling middleware (after all other middlewares and routes)
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

// Graceful shutdown logic
process.on("SIGTERM", async () => {
  console.log("Shutting down...");
  try {
    await pgClient().end();
    console.log("Database connection pool closed.");
  } catch (error) {
    console.error("Error during shutdown:", error);
  }
  process.exit(0);
});
