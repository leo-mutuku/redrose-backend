import "reflect-metadata";
import helmet from "helmet";
import express, { Application, NextFunction, Request, Response } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler"; // Adjust path
import routers from "./routes";
import cors from "cors";
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
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});
