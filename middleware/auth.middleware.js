import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async(req, res)=>{
    try {
        const token = req.cookies.token

        if(!token){
            return res.status(401).json({
                message: "Not authenticated"
            })
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(401).json({
                message: "User not found"
            })
        }
        req.user = user

        next()
    } catch (error) {
        return res.status(401).json({
        message: "Invalid or expired token",
        });
    }
}

export const adminOnly = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        return next()
    }

    return res.status(403).json({
        message: "Admin access required"
    })
}