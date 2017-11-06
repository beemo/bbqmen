var entries = require('./entries.controller.js')

module.exports = function (app, auth, mail, settings, models) {
  // GET
  app.get('/api/entries/', entries.getEntries)
  // GET BY ID
  app.get('/api/entries/:entriesId', entries.getEntriesById)
  // POST
  app.post('/api/entries', entries.postEntries)
  // PUT
  app.put('/api/entries/:entriesId', entries.putEntries)
  // DELETE
  app.delete('/api/entries/:entriesId', entries.deleteEntries)
  // PARAM
  app.param('entriesId', entries.paramEntries)
}
