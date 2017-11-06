var mongoose = require('mongoose')

var imageSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user_id: {
    type: String,
    trim: true,
    required: true
  },
  entryId: {
    type: String,
    trim: true,
    required: true
  },
  vuePath: {
    type: String,
    trim: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  }
})

module.exports = imageSchema
