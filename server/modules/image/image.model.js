var mongoose = require('mongoose')

var imageSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  vuePath: {
    type: String,
    trim: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: true
  },
  image: {
    type: mongoose.Schema.ObjectId,
    ref: 'image'
  },

})

module.exports = imageSchema
