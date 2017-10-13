var assert = require('chai').assert
var request = require('supertest')

describe('Entries', function () {
  describe('GET /api/entries', function () {
    it('should be returning entries', function (done) {
      request('localhost:3000/')
        .get('api/entries')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.deepEqual(res.body, [])
          done()
        })
    })
  })
})
