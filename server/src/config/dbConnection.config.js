import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log(`DB Connection Successfull...😊`);
  } catch (error) {
    console.log(`DB Connection Error...🥲 ${error}`);
  }
};

export default dbConnect;
