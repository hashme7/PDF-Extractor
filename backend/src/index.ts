import express from "express";
import cors from "cors";
import routes from "./routes/index";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      process.env.FRONTEND || "https://pdf-extractor-kue7.vercel.app",
    ],
    methods: ["GET", "POST"],
  })
);

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/", routes);

app.listen(3000, () => {
  console.log("Server is running");
});
