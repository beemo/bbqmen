var auto = require('run-auto')
var mongoose = require('mongoose')
var entriesSchema = mongoose.model('entries')
var _ = require('lodash')

exports.getEntries = function (req, res, next) {
  auto({
    entriesSchema: function (cb) {
      var obj = {};
      if (req.query.user) {
        obj.user = req.query.user
      }
      entriesSchema
        .find(obj)
        .populate('photo user')
        .exec(cb)
    }
  }, function (err, results) {
    if (err) return next(err)
    return res.status(200).send(results)
  })
}
exports.deleteEntries = function (req, res, next) {
  req.entries.remove(function () {
    res.status(204).send()
  })
}
exports.postEntries = function (req, res, next) {
  req.assert('user', 'The user cannot be blank').notEmpty()
  req.assert('user', 'The user must be a valid ID').isMongoId()
  console.log('req.body:', req.body)
  console.log('req.headers:', req.headers)

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      msg: errors[0].msg,
      redirect: '/'
    })
  }
  entriesSchema.create(req.body, function (err, data) {
    console.log('err', err)
    if (err) return next(err)
    return res.status(201).send(data)
  })
}

exports.putEntries = function (req, res, next) {
  req.entries = _.merge(req.entries, req.body)
  req.entries.save(function (err) {
    console.log('err', err)
    if (err) return next(err)
    return res.status(200).send(req.entries)
  })
}

exports.getEntriesById = function (req, res, next) {
  res.send(req.entries)
}
exports.paramEntries = function (req, res, next, id) {
  req.assert('entriesId', 'Your entries ID cannot be blank').notEmpty()
  req.assert('entriesId', 'Your entries ID has to be a real id').isMongoId()

  var errors = req.validationErrors()
  if (errors) {
    console.log(errors)
    return res.status(400).send({
      success: false,
      msg: errors[0].msg,
      redirect: '/'
    })
  }
  auto({
    entries: function (cb) {
      entriesSchema
        .findOne({_id: id})
        .populate('photo user')
        .exec(cb)
    }
  }, function (err, results) {
    if (err) return next(err)
    req.entries = results.entries
    next()
  })
}
