const mongoose = require('mongoose');
const config  = require('config');
mongoose.Promise = Promise;





const connectDB = async () => {

    try {
        await mongoose.connect(config.get('MongoURI'), {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology:true
        });
        console.log('DB connected')
    } catch (e) {
         console.error(e);
    }
};
module.exports = connectDB;
