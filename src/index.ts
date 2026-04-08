import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Application } from "express";
import configCors from "./configs/cors";
import initWebRoute from "./routes/web.route";

// dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Application = express();
app.get("/", (req, res) => res.status(200).send("Server is alive"));
app.get("/health", (req, res) => res.send("OK"));


// configCors(app);

// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));

// initWebRoute(app);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
