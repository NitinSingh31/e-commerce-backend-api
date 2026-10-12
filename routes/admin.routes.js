import express from "express"
import { adminOnly, protect } from "../middleware/auth.middleware.js"

const router = express.Router()

router.get("/dashboard", protect, adminOnly, (req, res)=>{
    res.status(200).json({
        message:"Welcome to admin dashboard",
        user: req.user
    })
})

export default router