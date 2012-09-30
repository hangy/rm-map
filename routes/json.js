function writeJsonAndEnd(res, data) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(data));
}

function reqToLoc(req) {
  return bodyToLoc(req.body);
}

function bodyToLoc(body) {
  return [ parseFloat(body.lat), parseFloat(body.lng) ];
}

exports.retrieve = function(req, res){
  require('mongodb').connect(res.app.get('mongodb'), function(err, conn){
    conn.collection('points', function(err, coll){
      coll.find({}, {}, function(err, cursor){
        cursor.toArray(function(err, items){
          writeJsonAndEnd(res, items);
        });
      });
    });
  });
};

exports.create = function(req, res) {
  require('mongodb').connect(res.app.get('mongodb'), function(err, conn){
    conn.collection('points', function(err, coll){
      var doc = {
        userid: parseInt(req.session.userid),
        nick: req.session.nick,
        description: '',
        loc: reqToLoc(req)
      };
      coll.insert(doc, {safe: true}, function(err, records){
        writeJsonAndEnd(res, records);
      });
    });
  });
};

exports.update = function(req, res) {
  var mongo = require('mongodb');
  var BSON = mongo.BSONPure;
  var o_id = new BSON.ObjectID(req.params.id);

  mongo.connect(res.app.get('mongodb'), function(err, conn){
    conn.collection('points', function(err, coll){
      coll.update(
        {_id: o_id, userid: parseInt(req.session.userid)},
        {$set: {loc: reqToLoc(req) }},
        {safe: true, multi: false, upsert: false},
        function (err, modified) {
          res.end(modified + '\n');
        });
    });
  });
};

exports.delete = function(req, res) {
  var mongo = require('mongodb');
  var BSON = mongo.BSONPure;
  var o_id = new BSON.ObjectID(req.params.id);

  mongo.connect(res.app.get('mongodb'), function(err, conn){
    conn.collection('points', function(err, coll){
      coll.remove({_id: o_id, userid: parseInt(req.session.userid)});
    });
  });
};
