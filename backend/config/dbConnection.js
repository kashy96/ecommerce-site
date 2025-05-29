import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

//Database connection here!
 const dbConnection  = ()=>{
    mongoose.connect(process.env.DB_URL,{
       dbName: "ecommerce"
    }).then(()=>{ 
       console.log("MongoDB Connected Sucessfully !")
    }).catch((error)=>{
        console.log(`Failed to connect ${error}`)
    })
    
}
export default dbConnection;