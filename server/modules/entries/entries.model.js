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
    cookTimes: {
          start: Date,
          end: Date
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

entriesSchema.virtual('cookTime').get(function() {
  return (`${this.cookTimes.start} - ${this.cookTimes.end}`);
});

entriesSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    title: this.title,
    flavor: this.results.flavor,
    texture: this.results.texture,
    appearance: this.results.appearance,
    overall: this.results.overall,
    meat: this.ingredients.meat,
    marinade: this.ingredients.marinade,
    injection: this.ingredients.injection,
    slather: this.ingredients.slather,
    rub: this.ingredients.rub,
    smoker: this.cook.smokerModel,
    tempurature: this.cook.temp,
    wood: this.cook.woodType,
    electric: this.cook.electricHeatingElement,
    pellets: this.cook.woodPellets,
    charcoal: this.cook.charcoal,
    cookTime: this.cookTime,
    created: this.created
  };
}

const BbqEntry = mongoose.model('BbqEntry', bbqEntrySchema);

module.exports = entriesSchema
