const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

//add product for a testing

router.post("/add", async (req , res) =>{
    try{
        const product = new Product(req.body);
        await product.save();
        res.json(product);
    } catch (err){
        res.status(500).json({error : err.message});
    }
});

//Get product by barcode 

router.get("/:barcode" , async (req , res) => {
        console.log("Barcode hit:", req.params.barcode); 

    try{
        const product = await Product.findOne({ barcode: req.params.barcode});

        if (!product){
            return res.status(404).json({message: "Product Not Found"});
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;

