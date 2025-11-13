import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
// import inventoryRoutes from "./routes/inventoryRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import invoiceRoutes from "./routes/invoiceRoutes.js";
// import staticticsRoutes from "./routes/statisticsRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
}));

//routes
app.use("/api/auth", authRoutes);
// app.use("/api/inventory", inventoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/invoices", invoiceRoutes);
// app.use("/api/statistics", staticticsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});