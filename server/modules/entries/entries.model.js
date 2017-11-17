var mongoose = require('mongoose')

var entriesSchema = mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    trim: true
  },
  ingredients: {
    meat: String,
    marinade: String,
    injection: String,
    slather: String,
    rub: String,
    sauce: String
  },
  cook: {
    smokerModel: String,
    cookTime: {
          hours: Number,
          mins: Number
    },
    temp: Number,
    woodType: String,
    electricHeatingElement: Boolean,
    woodPellets: Boolean,
    charcoal: Boolean
  },
  results: {
    flavor: Number,
    texture: Number,
    appearance: Number,
    overall: Number
  },
  photo: {
    type: mongoose.Schema.ObjectId,
    ref: 'image',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'users'
  }
})

module.exports = entriesSchema
