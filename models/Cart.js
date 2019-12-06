const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const CartSchema = new Schema({
    
    userId:{
        type: Schema.Types.ObjectId, ref: 'Users', required: true},
    date:{
        type: Date,
        required: true
    },
    products:[{
        _id: {type: Schema.Types.ObjectId, ref: "products", required: true},
        name: {type: String},
        quantity: {type: Number},
    }],
    totalCartPrice: {
        type: Number
    },
    isOpen: {
        type: Number,
        required: true
    },
});

module.exports = Cart = mongoose.model('carts', CartSchema);
