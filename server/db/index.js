import mongoose from "mongoose"; 
const connectDB = async (MONGODB_URI,DB_NAME) => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
  //  const connectionInstance = await mongoose.connect(MONGODB_URI, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
    console.log(`\n MongoDb connected !! DB Host :
            ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
