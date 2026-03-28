const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
    items: [{
        name: String,
        barcode : String,
        quantity: Number ,  
        price: Number,
    },],
    totalAmount: Number,
    createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Bill" , BillSchema);