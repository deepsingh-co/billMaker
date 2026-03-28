
const billsRoute = require("./routes/billsRoute");
const express = require("express");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const connectDB = require("./config/db");
const app = express();


connectDB();


//middle ware

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/bills" , billsRoute);

// test route 
app.get("/" , (req , res) =>{
    res.send("Backend is running successfully");
});

// start the server

const PORT = 5000;
app.listen(PORT ,() =>{
    console.log(`Server is running on port ${PORT}`);
});