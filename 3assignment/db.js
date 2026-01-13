const {MongoClient} = require("mongodb");
require('dotenv').config();
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

let db

async function connectDB(){
    if (!db){
        await client.connect();
        console.log('MongoDB connected');
        db = client.db();
    }
    return db;
}

module.exports = connectDB;