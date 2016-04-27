var Datastore = require('nedb');

var db = new Datastore({ filename: 'authorization.db', autoload: true });

db.ensureIndex(
    {
        fieldName: 'expirationDate',
        expireAfterSeconds: 0
    },
    function(err) {
        if (err) throw err;
    }
);

module.exports = db;