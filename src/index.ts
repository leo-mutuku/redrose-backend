import "reflect-metadata";
import helmet from "helmet";
import express from "express";
const PORT = process.env.PORT || 9000;
import routers from "./routes";
const app = express();
app.use(express.json());
// Use helmet to set various HTTP headers for security
app.use(helmet());


app.use("/api/v1", routers);

app.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});
