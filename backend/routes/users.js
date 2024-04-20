const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// MongoDB Atlas connection string
const atlasConnectionURI = "mongodb+srv://admin:123@cluster0.xozpyua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Setup MongoDB Atlas connection
mongoose.connect(atlasConnectionURI);

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
