const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// Setup MongoDB connection
const connectionURI = process.env.MONGO_CONNECTION || "mongodb://127.0.0.1:27017/pinterest-clone";

mongoose.connect(connectionURI).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("Failed to connect to MongoDB", err);
});

const userSchema = new mongoose.Schema({
  fullname: String,
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: String, // Handled by passport-local-mongoose
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }],
  profileImage: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
  },
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
