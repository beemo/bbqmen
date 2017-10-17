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
    rub: String
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user'
  }
})

module.exports = entriesSchema
