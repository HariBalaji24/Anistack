const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userrouter = require("./routes/userroutes");

dotenv.config({ path: "./config.env" });

const app = express();
const port = process.env.PORT || 3000;

// ✅ Fix CORS here
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true, // allow cookies/token headers
  exposedHeaders: ["Authorization"] // allow frontend to access token header
}));

app.use(express.json());

app.use("/user", userrouter); // ✅ Route prefix should match frontend usage

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
