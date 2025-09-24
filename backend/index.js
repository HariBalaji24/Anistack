import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userrouter from "./routes/userroutes.js";

dotenv.config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 3000;

// ✅ Fix CORS here
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true, 
}));

app.use(express.json());

app.use("/user", userrouter); // ✅ Route prefix should match frontend usage

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
