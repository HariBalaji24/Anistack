import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userrouter from "./routes/userroutes.js";

dotenv.config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://anistack-wine.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use("/user", userrouter); // ✅ Route prefix should match frontend usage

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
