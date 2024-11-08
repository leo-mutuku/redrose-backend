import "reflect-metadata";
import express from "express";
const PORT = process.env.PORT || 9000;
import routers from "./routes";
const app = express();
app.use(express.json());


app.use("/api/v1", routers);

app.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});
