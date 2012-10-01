var express = require('express')
  , routes = require('./routes')
  , signin = require('./routes/signin')
  , json = require('./routes/json')
  , http = require('http')
  , path = require('path');

var Db = require('mongodb').Db
  , Server = require('mongodb').Server
  , server_config = new Server('localhost', 27017, {auto_reconnect: true, native_parser: true})
  , db = new Db('rmmap', server_config, {})
  , mongoStore = require('connect-mongodb');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('trust proxy', true);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('kDzRXXNU5RzKpLQsKWTxU4uX'));
  app.use(express.session({
    cookie: {maxAge: 3600000},
    secret: 'kDzRXXNU5RzKpLQsKWTxU4uX',
    store: new mongoStore({db: db})
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(function(req, res, next){
    var err = req.session.error
      , msg = req.session.success;
    delete req.session.error;
    delete req.session.success;
    res.locals.message = '';
    if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
    if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
    next();
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

function restrict(req, res, next) {
  if (req.session.id && req.session.nick) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.send(403);
  }
}

app.get('/', routes.index);
app.post('/signin', signin.validate);
app.get('/json', restrict, json.retrieve);
app.post('/json', restrict, json.create);
app.put('/json/:id', restrict, json.update);
app.delete('/json/:id', restrict, json.delete);

app.set('mongodb', 'mongodb://localhost/rmmap');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
