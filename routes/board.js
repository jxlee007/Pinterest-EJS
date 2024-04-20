const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: String,
    posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }]
  });
  
  module.exports = mongoose.model('Board', boardSchema);