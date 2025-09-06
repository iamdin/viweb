import cors from "cors";
import express, { json } from "express";
import apiRouter from "./routes/index.js";

const app = express();

app.use(cors());
app.use(json());

app.use("/api", apiRouter);

app.listen(9000, () => {
	console.log(`server is running on port ${9000}`);
});
