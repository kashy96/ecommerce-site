import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Category } from "../models/categorySchema.js";
import { sendResponse } from "../utils/responseFormatter.js";

export const categories = catchAsyncErrors(async (req, res, next) => {
    try {
        const categories = await Category.find().select('_id name description slug');
        sendResponse(res, 200, categories);
    } catch (error) {
         sendResponse(res, 500, {
            message: 'Something went wrong while fetching categories!',
            error: error.message,
        });
    }
});