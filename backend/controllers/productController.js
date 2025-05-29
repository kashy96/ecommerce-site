import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Product } from "../models/productSchema.js";
import { Category } from "../models/categorySchema.js";
import { sendResponse } from "../utils/responseFormatter.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';


// For ES modules to get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/products'); // Make sure this directory exists
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Initialize multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export const dashboardProducts = catchAsyncErrors(async (req, res, next) => {
  try {
      const { pageIndex, pageSize } = req.query;

      // Ensure pageIndex and pageSize are valid numbers
      const page = parseInt(pageIndex) || 0; // Default to page 0 if not provided
      const limit = parseInt(pageSize) || 10; // Default to 10 items per page if not provided

      // Calculate the number of documents to skip
      const skip = page * limit;

      // Fetch paginated products
      const products = await Product.find()
          .skip(skip)
          .limit(limit)
          .populate('category', 'name')
          .sort({ _id: -1 }); 

      // Optionally, get the total number of products for frontend pagination
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);

      sendResponse(res, 200, {
          products,
          page,
          pageSize: limit,
          totalProducts,
          totalPages,
      });
  } catch (error) {
      sendResponse(res, 500, {
          message: "Something went wrong while fetching products!",
          error: error.message,
      });
  }
});

export const products = catchAsyncErrors(async (req, res, next) => {
  try {
    let products;
    const { category } = req.query; 
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        products = await Product.find({ category: categoryDoc._id });
      } else {
        products = [];
      }
    } else {
      products = await Product.find({});
    }
    
    return sendResponse(res, 200, { products });
  } catch (error) {
    return sendResponse(res, 500, {
      message: "Something went wrong while fetching products!",
      error: error.message,
    });
  }
});

export const product = catchAsyncErrors(async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug: slug });
    const relatedProducts = await Product.find({ 
      category: product.category,
      _id: { $ne: product._id }
    });
    
    return sendResponse(res, 200, { product, relatedProducts });
  } catch (error) {
    return sendResponse(res, 500, {
      message: "Something went wrong while fetching product detail!",
      error: error.message,
    });
  }
});

export const productsGroupedByCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    // Use aggregation to group products by category and include category name
    const productsGroupedByCategory = await Product.aggregate([
      {
        $lookup: {
          from: 'categories', // Replace with your category collection name
          localField: 'category', // Assuming 'category' in Product is the category ID
          foreignField: '_id', // Assuming '_id' in Category is the identifier
          as: 'categoryDetails', // This will store the category details
        },
      },
      {
        $unwind: { path: '$categoryDetails', preserveNullAndEmptyArrays: true }, // Unwind the category details to access the name
      },
      {
        $group: {
          _id: '$categoryDetails.name', // Group by category name (not ID)
          products: { $push: '$$ROOT' }, // Add all products to an array under each category
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field from the result
          category: '$_id', // Rename _id to 'category'
          products: 1, // Include the products array
        },
      },
    ]);

    // Send a successful response with the grouped products
    sendResponse(res, 200, productsGroupedByCategory);
  } catch (error) {
    // Send an error response with a message in the data field
    sendResponse(res, 500, {
      message: 'Something went wrong while fetching products!',
      error: error.message,
    });
  }
});

export const addProduct = catchAsyncErrors(async(req, res, next) => {
  try {
    // The upload middleware will add the file to req.file
    const uploadSingle = upload.single('image');
    
    uploadSingle(req, res, async function(err) {
      if (err) {
        return next(new ErrorHandler(err.message, 400));
      }
      
      const { name, description, category, stock, price } = req.body;
      
      // Validate required fields
      if (!name || !description || !category || !stock || !price) {
        return next(new ErrorHandler('Please fill all required fields', 400));
      }
      
      // Create product object
      const productData = {
        name,
        description,
        category,
        stock: Number(stock),
        price: Number(price)
      };
      
      // Add image path if image was uploaded
      if (req.file) {
        productData.image = `/uploads/products/${req.file.filename}`;
      }
      
      // Save to database
      const product = await Product.create(productData);

      sendResponse(res, 200, product);
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});