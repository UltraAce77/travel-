const mongoose = require("mongoose");

async function connectDatabase() {
   if (mongoose.connection.readyState === 1) return true;
   const uri = process.env.MONGODB_URI;
   if (!uri) throw new Error("MONGODB_URI is not set");
   await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
   console.log("Successfully connected to MongoDB.");
   return true;
}

async function testDBConnection() {
   if (mongoose.connection.readyState !== 1) throw new Error("MongoDB is not connected");
   await mongoose.connection.db.admin().ping();
   return true;
}

async function closeDatabase() { await mongoose.connection.close(); }
module.exports = { connectDatabase, testDBConnection, closeDatabase };