import app from "./app.js";
// import cloudinary from "cloudinary";


app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
