const mongoose = require('mongoose');

module.exports = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {dbName: process.env.DB_NAME});
        console.log('Connected to database');
    } catch (error) {
        console.error(`Error connecting to the database. \n${error}`);
    }
}