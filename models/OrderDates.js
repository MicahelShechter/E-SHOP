const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderDatesSchema = new Schema({
    date: {
        type: Date,
        required: true
    }
});

module.exports = OrderDates = mongoose.model('orderDates', OrderDatesSchema);
