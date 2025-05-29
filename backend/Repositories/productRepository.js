import { Product } from "../models/productSchema.js";

export const products = async () => {
    const products = await Product.find();
    return products;
}

export const productById = async (id) => {
    const product = await Product.findById(id);
    return product;
}

// exports.createProduct = async (payload) => {
//     const newProduct = await Product.create(payload);
//     return newProduct;
// }

// exports.removeProduct = async (id) => {
//     const product = await Product.findByIdAndRemove(id);
//     return product;
// }

export const updateProductQuantity = async (productId, quantity) => {
    const product = await Product.findByIdAndUpdate(productId, {quantity: `${quantity}`});
    return product;
}