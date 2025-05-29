import express from "express";
import dbConnection  from "./config/dbConnection.js";;
import authRouter from "./routes/authRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
// import fileUpload from "express-fileupload";
import productRouter from  "./routes/productRoutes.js"
import categoryRouter from "./routes/categoryRoutes.js"
import cartRouter from "./routes/cartRoutes.js"
import orderRouter from "./routes/orderRoutes.js"

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp/",
//   })
// );
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

dbConnection();

app.use(errorMiddleware);
export default app;
