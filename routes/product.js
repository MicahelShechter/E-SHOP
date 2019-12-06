const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Products');
const auth = require("../middleware/auth");

//@route  GET URL/api/product/
//@desc   Get all products
//@access  Private
//TODO: add auth middleware
router.get("/", async (req, res) => {
console.log('Your in the all product route ');
    Product.find()
        .then(products =>{
            res.status(200).json(products)
        }).catch(err=>{
            res.status(500).json({
                msg:"No products"
            })
    })
});

// @route  POST URL/api/product/
// @desc   add new product
//@access  private
router.post("/addProduct", async (req, res) => {
    const product = new Product({
        categoryId: req.body.categoryId,
        name: req.body.name,
        price: req.body.price,
        imageURL: req.body.imageURL,
    });
    product.save()
        .then(product => res.status(200).json(product))
        .catch(err => console.log(err));
});

// @route  PUT URL/api/product/
// @desc   Update  new product
//@access  private
router.put('/editProductById/:id',async (req,res)=> {
    Product.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(() => {
            Product.findOne({_id: req.params.id})
                .then((product) => {
                    res.json(product)

                }).catch(err => {
                console.error(err);
                res.status(500).send(err)
            })
        })

        });

module.exports = router;
