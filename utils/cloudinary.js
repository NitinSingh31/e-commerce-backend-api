import { v2 as cloudinary } from "cloudinary"

export const uploadToCloudinary = (fileBuffer, folder = "ecommerce") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {
                if(error){
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
        uploadStream.end(fileBuffer)
    })
}