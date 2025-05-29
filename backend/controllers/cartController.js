import { createCart, cart as cartDetail, updateItemToCart, addItemToCart as addItemToCartService, deleteItemFromCart } from "../Repositories/cartRepository.js";

import { users, userById } from "../Repositories/userRepository.js"
import { products, productById,  updateProductQuantity} from "../Repositories/productRepository.js"
import { sendResponse } from "../utils/responseFormatter.js";
import { Cart } from "../models/cartSchema.js";

export const addItemToCart = async (req, res) => {
    const userId = req.body.userId;
    const productId = req.body.productId;
    const quantity = Number.parseInt(req.body.quantity);

    try {
        let product = await productById(productId);
        
        if (!product) {
            return sendResponse(res, 500, {
                message: "Product Not Found",
                error: error.message,
            });
        }

        let cart = await cartDetail(userId);

        // If cart doesn't exist for given userId then will create new cart and add the product into it.
        if (cart == null) {
            try {
                if (quantity <= product.stock) {
                    const cartData = {
                        userId: userId,
                        items: [{
                            productId: productId,
                            quantity: quantity,
                            name: product.name,
                            image: product.image,
                            price: product.price,
                            total: parseInt(product.price * quantity)
                        }],
                        subTotal: parseInt(product.price * quantity)
                    }
                    let updatedCart = await createCart(cartData);

                    // update product quantity in product repository
                    let updatedProduct = await updateProductQuantity(productId, (product.stock - quantity));

                    return sendResponse(res, 200, {
                        updatedCart: updatedCart,
                        updatedProduct: updatedProduct
                    });
                } else {
                    return sendResponse(res, 500, {
                        message:  "Unsufficient quantity entered!"
                    });
                }
            } catch (err) {
                console.log(err)
                return sendResponse(res, 400, {
                    message: "Something Went Wrong",
                    error: err
                });
            }
        }

        // cart exists for userId, will fetch items and update that array accordingly
        else {
            // console.log("length of items of cart : " + cart.items?.length);
            let indexFound = cart.items.findIndex(item => item.productId == productId);

            console.log('The index found is',indexFound);
            

            if (indexFound !== -1) {
                if (quantity <= product.stock) {
                    let productQuantity = parseInt(cart.items[indexFound].quantity) + quantity;
                    let productPrice = parseInt(product.price);
                    let totalProductAmount = parseInt(productQuantity * productPrice);
                    
                    const subTotal = parseInt(cart.subTotal) + parseInt(product.price * quantity);
                    
                    let updatedCart = await updateItemToCart(
                        userId, 
                        productId, 
                        productQuantity, 
                        productPrice, 
                        totalProductAmount, 
                        subTotal, 
                        product.image, 
                        product.name
                    );
                    // Update product quantity in product repository
                    let updatedProduct = await updateProductQuantity(productId, (product.stock - quantity));

                    return sendResponse(res, 200, {
                        updatedCart: updatedCart,
                        updatedProduct: updatedProduct
                    });
                } else {
                    return sendResponse(res, 500, {
                        message: "Insufficient quantity entered!"
                    });
                }
            } else if (indexFound == -1 && quantity > 0) {
                if (quantity <= product.stock) {
                    const itemData = {
                        productId: productId,
                        quantity: quantity,
                        name: product.name,
                        image: product.image,
                        price: product.price,
                        total: parseInt(product.price * quantity),
                    };
                    const subTotal = parseInt(cart.subTotal) + parseInt(product.price * quantity);

                    let updatedCart = await addItemToCartService(userId, itemData, subTotal);
                    // Update product quantity in product repository
                    let updatedProduct = await updateProductQuantity(productId, (product.stock - quantity));

                    return sendResponse(res, 200, {
                        updatedCart: updatedCart,
                        updatedProduct: updatedProduct
                    });
                } else {
                    return sendResponse(res, 500, {
                        message: "Insufficient quantity entered!"
                    });
                }
            }
        }
    }
    catch (err) {
        return sendResponse(res, 400, {
            message: "Something went wrong for addItemToCart",
            error: err
        });
    }

}

export const viewCart = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await userById(userId);
        const cart = await cartDetail(userId);
        console.log("user : "+user);
        console.log("cart : "+cart);
        if(!user) {
            return sendResponse(res, 400, {
                type: "Invalid",
                message:  "User not found!"
            });
        } else if (cart == "") {
            return sendResponse(res, 400, {
                message: "Cart is empty!"
            });
        } else {
            return sendResponse(res, 200, {
                cart: cart
            });
        }
    } catch (err) {
        console.log(err);
        return sendResponse(res, 400, {
            type: "Invalid",
            message: "Something went wrong",
            error: err
        });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.params.id;
        const productId = req.body.productId;

        const cart = await cartDetail(userId);
        const product = await productById(productId);

        // search productId in the items
        let indexFound = cart.items.findIndex(item => item.productId == productId);

        if (indexFound !== -1) {
            const amountToUpdateInSubTotal = parseInt(cart.subTotal) - parseInt(cart.items[indexFound].total);
            const updatedCart = await deleteItemFromCart(userId, productId, amountToUpdateInSubTotal);
            
            // update product quantity in product repository
            const updatedQuantity = parseInt(product.stock) + parseInt(cart.items[indexFound].quantity);
            const updatedProduct = await updateProductQuantity(productId, updatedQuantity);

            return sendResponse(res, 200, {
                updatedCart: updatedCart,
                updatedProduct: updatedProduct
            }); 
        } else {
            return sendResponse(res, 500, {
                type: "Invalid",
                message: "Item doesn't exist in cart!"
            });
        }
    } catch (err) {
        console.log(err);
        return sendResponse(res, 400, {
            type: "Invalid",
            message: "Something went wrong!",
            error: err
        });
    }
}

export const emptyCart = async (req, res) => {
    try {
        const userId = req.params.id;

        const cart = await cartDetail(userId);
        if (!cart) {
            return sendResponse(res, 404, {
                message: "Cart not found",
            });
        }

        await cart.deleteOne();

        return sendResponse(res, 200, {
            message: "Cart removed successfully",
        });
    } catch (error) {
        return sendResponse(res, 500, {
            message: error.message,
        });
    }
};

