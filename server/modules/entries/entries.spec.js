var assert = require('chai').assert
var request = require('supertest')
var entryid

describe('Entries', function () {
  describe('GET /api/entries', function () {
    it('should be returning array', function (done) {
      request('localhost:3000/')
        .get('api/entries/')
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.isArray(res.body.entriesSchema)
          entryid = res.body.entriesSchema[0]._id
          done()
        })
    })
    it('should be returning object', function (done) {
      request('localhost:3000/')
        .get('api/entries/' + entryid)
        .expect(200, function (err, res) {
          if (err) return done(err)
          assert.isObject(res.body)
          done()
        })
    })


  })
})
