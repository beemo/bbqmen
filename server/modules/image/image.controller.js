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

  req.assert('entriesId', 'Your Entries ID cannot be blank').notEmpty()
  req.assert('entriesId', 'Your Entries ID has to be a real id').isMongoId()

  if (!req.file) {
    console.log('No image found with ' + req.body._id)
    return res.status(400).send()
  }

  console.log(req.file);
  var date = moment().format('M-D-Y')
  var tempDir = path.resolve(__dirname, './uploads/')

  // fs.readFile(req.file.path, function(err, data) {
  // if (err) {
  //   return next(err)
  // }
  //
  // fs.writeFile(createFile, data, (err) => {
  //   if (err) {
  //   console.error(`writeFile: FAIL - no access! to ${createFile}`, err)
  //   return err
  //   }
  //   console.log(`writeFile: SUCCESS - can write ${createFile}`)
  // });

  var tempPath = `${tempDir}/${req.file.filename}`
  var vueDir = `/Users/bmo/dev/bbqvue/static/${req.body.user_id}`
  var vueFile = `${date}_${req.file.originalname}`
  var vuePath = `${vueDir}/${vueFile}`

  if (sh.exec(`if [ ! -d ${vueDir} ]; then mkdir -p ${vueDir}; fi`).code !== 0) {
    sh.echo("Error: mkdir failed");
    sh.exit(1);
  }

  if (sh.mv(tempPath, vuePath).code !== 0) {
    sh.echo("Error: mv failed");
    sh.exit(1);
  }

  req.body.vuePath = `/static/${req.body.user_id}/${vueFile}`

  images.create(req.body, function(err, data) {
    if (err) {
      console.log(err)
      return next(err)
    }
    return res.status(201).send(data)
  })
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
  req.assert('name', 'The name cannot be blank').notEmpty()
  // console.log(req)
  if (req.multerError) {
    return res.status(400).send({
      success: false,
      msg: req.multerError,
      redirect: '/'
    })
  }
  var errors = req.validationErrors()
  if (errors) {
    return res.status(400).send({
      success: false,
      msg: errors[0].msg,
      redirect: '/'
    })
  }
  req.body.user = req.user._id
  images.create(req.body, function(err, data) {
    if (err) return next(err)
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
  console.log('req:', req)
  console.log('id:', id)

  req.assert('imageId', 'Your Image ID cannot be blank').notEmpty()
  req.assert('imageId', 'Your Image ID has to be a real id').isMongoId()

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
          entryId: id
        })
        .exec(cb)
    }
  }, function (err, results) {
    if (err) return next(err)
    req.image = results.image
    next()
  })
}
