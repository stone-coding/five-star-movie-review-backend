const mongoose = require("mongoose");

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("db is connected!");
//   })
//   .catch((ex) => {
//     console.log("db is failed:", ex);
//   });

  exports.connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };