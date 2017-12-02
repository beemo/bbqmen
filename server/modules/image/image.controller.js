var auto = require('run-auto')
var mongoose = require('mongoose')
var images = mongoose.model('image')
var _ = require('lodash')
var multer = require('multer')
var fs = require('fs')
var debug = require('debug')('menstackjs:images')
var path = require('path')
var moment = require('moment')
var sh = require('shelljs')

exports.upload = function(req, res, next) {
  console.log(req.body)

  req.assert('user', 'Your user ID cannot be blank').notEmpty()
  // req.assert('user', 'Your user ID has to be a real id').isMongoId()

  if (!req.file) {
    console.log('No image found with ' + req.body._id)
    return res.status(400).send()
  }

  if (req.method == "PUT" && req.image) {
    var oldSize = sh.exec('du /Users/bmo/dev/fe' + req.image.vuePath + ' | cut -f 1')
    var newSize = sh.exec(`du ${req.file.path} | cut -f 1`)
    if (oldSize == newSize) {
      console.log('Source and destination images are the same.')
      return res.status(200).send(req.image)
    }
  }

  console.log(req.file);
  var date = moment().format('M-D-Y')
  var tempDir = path.resolve(__dirname, './uploads/')

  var tempPath = `${tempDir}/${req.file.filename}`
  var vueDir = `/Users/bmo/dev/fe/static/${req.body.user}`
  var vueFile = `${date}_${req.file.originalname}`
  var vuePath = `${vueDir}/${vueFile}`

  if (sh.exec(`if [ ! -d ${vueDir} ]; then mkdir -p ${vueDir}; fi`).code !== 0) {
    console.log('exports.upload mkdir failed')
  }

  if (sh.mv(tempPath, vuePath).code !== 0) {
    console.log('exports.upload mv failed')
  }
  req.body.vuePath = `/static/${req.body.user}/${vueFile}`
  next()
}

exports.getImage = function(req, res, next) {
  auto({
    images: function(cb) {
      images
        .find()
        .exec(cb)
    }
  }, function(err, results) {
    if (err) return next(err)
    return res.status(200).send(results.images)
  })
}
exports.deleteImage = function(req, res, next) {
  req.image.remove(function() {
    res.status(204).send()
  })
}
exports.postImage = function(req, res, next) {
  req.assert('user', 'The user ID cannot be blank').notEmpty()

  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      msg: errors[0].msg,
      redirect: '/'
    })
  }

  images.create(req.body, function(err, data) {
    if (err) {
      console.log(err)
      return next(err)
    }
    return res.status(201).send(data)
  })
}

exports.putImage = function(req, res, next) {

  req.image = _.merge(req.image, req.body)
  req.image.save(function(err) {
    console.log('err', err)
    if (err) return next(err)
    return res.status(200).send(req.image)
  })
}

exports.getImageById = function(req, res, next) {
  res.send(req.image)
}

exports.paramImage = function(req, res, next, id) {
  req.assert('imageId', 'Your image _id cannot be blank').notEmpty()
  req.assert('imageId', 'Your image _id has to be a real id').isMongoId()

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
    image: function(cb) {
      images
        .findOne({
          _id: id
        })
        .exec(cb)
    }
  }, function(err, results) {
    if (err) return next(err)
    // req.images = _.clone(req.image)
    req.image = results.image
    console.log('req.image: ', req.image)
    next()
  })
}
