import mongoose from "mongoose";

const db = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected");
    } catch (error) {
        console.log("Error in database connection", error);
    }
}

export default db;