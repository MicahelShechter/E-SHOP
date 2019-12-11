const express = require('express');
const router = express.Router();
const Cart  = require("../models/Cart");
const auth = require("../middleware/auth");


// TODO: Check the route error
router.post("/createCart",async (req, res) => {
    console.log(req.body);
    console.log(req.body.userId.userId);
    const cart = new Cart({
        userId: req.body.userId,
        isOpen: 0,
        totalCartPrice: 0,
        date: new Date(),

    });
    cart.save()
        .then(cart =>{
            res.status(200).json({
                msg:'Cart Created!',
                cart: cart
            })
        })
        .catch(err =>{
            console.log(err.message);
            res.status(500).json({
                msg: 'Cart creation feild'
            })
        })
});

router.get("/getUserCartStatus/:id",async (req,res)=>{
    Cart.findOne({userId: req.params.id})
        .then(cart => {
            if (cart === null) {
                return res.status(202).json({
                    msg: "no carts"
                })
            }
            if (cart.isOpen === 0) {
                return res.status(200).json({
                    msg: "cart initialized",
                    status: 0,
                    cart: cart
                })
            }
            if (cart.isOpen === 1) {
                return res.status(201).json({
                    msg: `You Have An Open Cart From: ${cart.date.toDateString()}, Total: ${parseFloat(cart.totalCartPrice).toFixed(2)}$`,
                    status: 1,
                    cart: cart
                })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        })

});


router.put("/updateCartStatus", async (req,res) => {
    Cart.findOneAndUpdate({_id: req.params.id}, req.body)
        .then(() => {
            Cart.findOne({_id: req.params.id})
                .then(cart => {
                    res.status(200).json(cart)
                })
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        })
} );

router.put("/addProductToCart/:_id", async (req,res) => {
    console.log(req.body);
    console.log(`cart id = ${req.params._id} | quantity = ${req.body.quantity} | product id = ${req.body._id} `);
    Cart.findOne({_id: req.params._id, products: {$elemMatch: {_id: req.body._id}}})
        .then(product => {
            console.log(product);

            if (product) {
                console.log(`Product found -> ${product}`);
                Cart.updateOne({_id: req.params._id, "products._id": req.body._id}, {
                    $set: {"products.$.quantity": req.body.quantity}
                })
                    .then(() => {
                        Cart.findById(req.params._id)
                            .then((cart) => {
                                return res.status(200).json(cart);
                            })
                    })
            } else {
                console.log(`Didnt found product in the cart`);
                Cart.findOneAndUpdate({_id: req.params._id}, {
                    $push: {
                        products: {
                            _id: req.body._id,
                             quantity: req.body.quantity,
                        }
                    }
                }, {new: true})
                    .then(() => {
                        Cart.findOne({_id: req.params._id})
                            .then((cart) => {
                                console.log(`the return value of cart ${cart} `);
                                res.status(200).json(cart);
                            })
                    })
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

router.put("/deleteProductFromCart/:id",async (req,res)=>{
    console.log(`id param: ${req.params.id} || ${req.body.productId} `);
    Cart.findOneAndUpdate({_id: req.params.id}, {$pull: {products: {_id: req.body.productId}}})
        .then(() => {
            Cart.findOne({_id: req.params.id})
                .then(cart => {

                    res.status(200).json(cart);
                })
        }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
});

router.put("/deleteAllProducts/:cardId", async (req,res)=>{
    console.log(`In the delete all cart product route || cartId = ${req.params.cardId}`);
    Cart.updateOne({_id: req.params.cardId}, {products: []},
            {safe: true, multi: true})
            .then(() => {
                Cart.findOne({_id: req.params.cardId})
                    .then(cart => {
                        console.log(`The return cart value is ${cart}`);
                        res.status(200).json(cart);
                    })
            }).catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});


router.put('/setCartTotalPrice/:id',async (req,res) =>{
   Cart.findOneAndUpdate({_id:req.params.id},{totalCartPrice:req.body.totalCartPrice})
       .then(()=>{
           Cart.findOne({_id: req.params.id})
               .then(cart => {
                   res.status(200).json(cart)
               })
       })
       .catch(err =>{
           res.status(500).send(err);
       })
});



module.exports = router;





