const express = require("express");
require("express-async-errors");
const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");
const { errorHandler } = require("./middlewares/error");
const cors = require("cors");
const { handleNotFound } = require("./utils/helper");

require("dotenv").config();
require("./db");

const app = express();
app.use(cors());
// mount the data request read by the request from user
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/*", handleNotFound);

app.use(errorHandler);

// app.post("/sign-in",
//     (req, res, next)=>{
//     const {email, password} = req.body
//     if (!email || !password )
//         return res.json({error:"email/password is missing"})
//         next();

// },
// (req, res ) =>{
//     res.send("<h1>Hello I am from you backend about page</h1>")
// })
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log("the port is listening on port " + PORT);
});
