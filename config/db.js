const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connect')
    } catch (error) {
        console.error('MongoDB connection failed', error);
        process.exit(1);
    }
}

module.exports = {connect};