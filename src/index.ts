import "reflect-metadata";
import helmet from "helmet";
import express from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler"; // Adjust path
import routers from "./routes";

const PORT = process.env.PORT || 9000;
const app = express();
app.use(express.json());
// Use helmet to set various HTTP headers for security
app.use(helmet());


app.use("/api/v1", routers);



// Error handling middleware (should be after all other middlewares and routes)
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});
