
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 30,
    minlength: 2,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    require: true,
    default: Date.now,
  }
});

module.exports = mongoose.model('card', cardSchema);