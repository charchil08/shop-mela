const express = require("express")
const app = express();
const cookieParser = require("cookie-parser")

const errorMiddleware = require("./middleware/error");

//import routes
const productRoutes = require("./routes/product");
const userRoutes = require("./routes/user")
const orderRoutes = require("./routes/order");

// middleware  
app.use(express.json());
app.use(cookieParser());


app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);

app.use(errorMiddleware);

module.exports = app;
