var express = require('express');
var router = express.Router();

/* get bill list */
router.get('/billlist', function(req, res) {
  var db = req.db;
  var collection = db.get('billlist');
  collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/* add to bill list */
router.post('/addbill', function(req, res) {
    var db = req.db;
    var collection = db.get('billlist');
    collection.insert(req.body, function(err, result) {
        res.send((err === null) ? {msg: ""}:{msg: err});
    });
});

router.delete('/deletebill/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('billlist');
    var billToDelete = req.params.id;
    collection.remove({ '_id' : billToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
