import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();


// Route
app.use("/api", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
