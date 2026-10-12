import Product from "../models/Product.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body

        if (!name || !description || !price || !category){
            return res.status(400).json({
                message: "Name, description, price and category are required"
            })
        }

        if(!req.file){
            return res.status(400).json({
                message: "Product image is required"
            })
        }

        const uploadedImage = await uploadToCloudinary(
            req.file.buffer,
            "ecommerce/products"
        )

        const product = await Product.create({
            name, 
            description,
            price,
            category,
            stock,
            images: [
                {
                    url: uploadedImage.secure_url,
                    publicId: uploadedIamge.public_id
                }
            ]
        })

        res.status(201).json({
            message: "Product created successfully",
            product,
        });


    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        })
    }
}

export const getProducts = async (req, res)=> {
    try {
        const {
            search,
            category,
            sort,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {}

        //search by product name
        if(search){
            filter.name = {
                $regex: search,
                $options: "i"
            }
        }

        //filter by category
        if(category){
            filter.category = category
        }

        //Pagination
        const skip = (page - 1) * limit;

        //sorting
        let sortOption = {}

        if(sort === "price-low"){
            sortOption.price = 1;
        } else if (sort === "price-high") {
            sortOption.price = -1;
        } else if (sort === "newest") {
            sortOption.createdAt = -1;
        }

        const products = await Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))

        const totalProducts = await Product.countDocuments(filter)

        res.status(200).json({
            products,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalProducts/limit),
                totalProducts
            }
        })



    } catch (error) {
        res.status(500).json({
            message: "failed to fetch products",
            error: error.message
        })
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }
        res.status(200).json({
            product
        })



    } catch (error) {
        res.status(500).json({
      message: "Failed to fetch product",
      error: error.message
    })
}
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
        return res.status(404).json({
        message: "Product not found",
      });
    }

    const { name, description, price, category, stock} = req.body

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;

    const updatedProduct = await product.save()

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });

    } catch (error) {
        res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    }
)
}
}

export const deleteProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }

        for(const image of product.image){
            await cloudinary.uploader.destroy(image.publicId)
        }

        await Product.findByIdAndDelete(req.params.id)

        res.status(200).json({
            message: "Product deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message,
    });
    }
}