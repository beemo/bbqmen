var image = require('./image.controller.js')
var multer = require('multer')
var upload = multer({ dest: '/Users/bmo/dev/bbqmen/server/modules/image/uploads/' })

module.exports = function (app, auth, mail, settings, models) {
  // GET
  app.get('/api/image/', image.getImage)
  // GET IMAGE BY ID
  app.get('/api/image/:imageId', image.getImageById)
  // POST
  app.post('/api/image', upload.single('file'), image.upload, image.postImage )
  // PUT
  app.put('/api/image/:imageId', upload.single('file'), image.upload, image.putImage)
  // DELETE
  app.delete('/api/image/:imageId', image.deleteImage)
  // PARAM
  app.param('imageId', image.paramImage)
}
