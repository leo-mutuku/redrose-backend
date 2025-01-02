import "reflect-metadata";
import helmet from "helmet";
import express, { NextFunction, Request, Response } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler"; // Adjust path
import routers from "./routes";
import cors from "cors";
import { pgClient } from "./dbConnection";
const PORT = process.env.PORT || 9000;
const app = express();
app.use(express.json());


app.use(helmet());
app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/v1", routers);



// Error handling middleware (should be after all other middlewares and routes)

app.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});
app.use(globalErrorHandler);



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