import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import cardRoutes from "./routes/cardRoutes";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";

const app: Express = express();

app.use(express.json());
app.use("/api", cardRoutes);
app.use("/api", productRoutes);
app.use("/api", userRoutes);

const PORT: number = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));