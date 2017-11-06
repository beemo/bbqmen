var assert = require('chai').assert
var request = require('supertest')

describe('Image', function () {
  describe('GET /api/image', function () {
    it('should be returning image', function (done) {
      request('localhost:3000/')
        .get('api/image')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
