import mongoose from "mongoose";

const db = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://sumit1711kd_db_user:sumit1711@cluster0.7mdotkq.mongodb.net/?appName=Cluster0");
    console.log("Database connected");
    } catch (error) {
        console.log("Error in database connection", error);
    }
}

export default db;