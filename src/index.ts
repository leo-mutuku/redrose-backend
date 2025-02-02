import "reflect-metadata";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler"; // Adjust path if necessary
import routers from "./routes";
import cors from "cors";
import { pgClient } from "./dbConnection";
import cron from 'node-cron';
import SalesReceipt from "./external-libraries/posPrint"
import SalesReceipt2 from "./external-libraries/posPrint2";
import rateLimit from 'express-rate-limit';

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
  "http://localhost:5174",
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

const print = new SalesReceipt()
const print2 = new SalesReceipt2()

// Rate Limiting Middleware (e.g., 1 request per second per IP)
const limiter = rateLimit({
  windowMs: 1000,  // 1 second
  max: 1,          // Allow only 1 request per second per IP
  message: 'Too many requests. Please try again in a second.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// Apply rate limiter to all routes
app.use(limiter);

// Route handling
app.use("/api/v1", routers);

// Global error handling middleware (after all other middlewares and routes)
app.use(globalErrorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

// Cron job to run every 9:35 AM
cron.schedule('35 9 * * *', () => {
  try {
    console.log('Cron job is running every 9:35 AM');
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});

// Shift close logic
cron.schedule('40 9 * * *', () => {
  try {
    console.log('Logic to end shift');
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});

// Logic to check if shift started or not, if not start shift in manual mode
cron.schedule('40 9 * * *', () => {
  try {
    console.log('Cron job is running every 9:35 AM');
  } catch (error) {
    console.error('Error running cron job:', error);
  }
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
