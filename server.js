import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectCloudinary from "./config/cloudinary.js";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js"
import productRoutes from "./routes/product.routes.js"

dotenv.config();
const app = express()

app.use(express.json())
app.use(cookieParser())

connectCloudinary();
connectDB()

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) =>{
    res.json({
        message: "E-commerce API is running"
    })
})

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes)

app.use("/api/products", productRoutes)



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})