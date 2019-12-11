const express = require('express');
const router = express.Router();
const Order =  require('../models/Order');
const { check, validationResult } = require("express-validator");
const Cart  = require('../models/Cart');
const OrderDates = require('../models/OrderDates');

router.get("/orders",  (req, res) => {
    Order.find({})
        .then(orders => res.status(200).json(orders))
        .catch(err => res.status(500).json({
            msg: "could not find any orders"
        }))
});


router.post("/createNewOrder", (req, res) => {
    console.log(req.body);
    const {shippingDate} = req.body;
    Order.find({shippingDate: shippingDate})
        .then(orders => {
            // check if the same delivery date exist more than 3 times
            if (orders.length >= 3) {
                return res.status(400).json({
                    msg: "all deliveries are occupied on this date"
                })
            }
            if (orders.length === 2) {
                newOrder(req);
                setFullyBookedDate(req);
                deleteClosedCart(req);
                return res.status(202).json({
                    success: "order created"
                })
            } else {
                newOrder(req);
                deleteClosedCart(req);
                res.status(200).json({
                    success: "order created"
                })
            }
        });
});


const newOrder = (req) => {
    const {userId, cartId, totalPrice, city, street, shippingDate, creditCard, products} = req.body;
    // const creditCardEnd = creditCard.slice(12, 16);
    const newOrder = new Order({
        userId: userId,
        cartId: cartId,
        totalPrice: totalPrice,
        city: city,
        street: street,
        orderDate: new Date(),
        shippingDate: shippingDate,
        creditCard: creditCard,
        products: products
    });
    newOrder.save()
};

const setFullyBookedDate = (req) => {
    const fullyBookedDate = new OrderDates({
        date: req.body.deliveryDate
    });
    fullyBookedDate.save();
};

const deleteClosedCart = (req) => {
    Cart.findById(req.body.cartId)
        .then(cart =>
            cart.remove())
        .catch(err => console.log(err))
};

router.get("/getLatestOrderByUserId/:id", (req, res) => {
    Order.find({userId: req.params.id})
        .sort({"orderDate": -1}).limit(1)
        .then(order => {
            res.json(order)
        }).catch((err) => {
        console.error(err);
        res.status(500).send(err);
    })
});


router.get('/getFullyBookedDates',(req,res) =>{
    OrderDates.find({})
        .then(dates => {
            return res.status(200).json(dates)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                msg: 'something went wrong'
            })
        })

});

module.exports = router;
