import { Cart } from "../models/cartSchema.js";

// create cart for userId and add item into it.
export const createCart = async (payload) => {
    const newCartForUser = await Cart.create(payload);
    return newCartForUser;
}

// return current cart based on userId here
export const cart = async (userId) => {
    const currentCart = await Cart.findOne({"userId": `${userId}`});
    return currentCart;
};

// item already exists, update quantity, total and subTotal of existing product
export const updateItemToCart = async (userId, productId, quantity, price, total, subTotal, productImage, productName) => {
    let query = {
        userId: userId,
        "items.productId": productId
    };

    let update = {
        $set: {
            "items.$[elem].quantity": quantity,
            "items.$[elem].name": productName,
            "items.$[elem].image": productImage,
            "items.$[elem].price": price,
            "items.$[elem].total": total,
            subTotal: subTotal
        }
    };

    let options = {
        new: true,
        upsert: true,
        arrayFilters: [{ "elem.productId": productId }]
    };

    const updatedCart = await Cart.findOneAndUpdate(query, update, options);
    return updatedCart;
};

// item not exist in cart, add item with provided quantity
export const addItemToCart = async (userId, itemData, subTotal) => {
    const updatedCart = await Cart.findOneAndUpdate(
        {"userId": `${userId}`}, 
        { $addToSet: {items: itemData}, subTotal: subTotal }, 
        { new: true, upsert: true }
    ); // new: true -> return updated document; upsert=update or insert
    return updatedCart;
};

// delete item from cart
export const deleteItemFromCart = async (userId, productId, amountToUpdateInSubTotal) => {
    const updatedCart = await Cart.findOneAndUpdate({"userId": `${userId}`}, {
        $pull: {
            items: {
                productId: productId
            }
        },
        $set: {
            subTotal: amountToUpdateInSubTotal
        }
    }, {new: true});

    return updatedCart;
}