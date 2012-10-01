
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , signin = require('./routes/signin')
  , map = require('./routes/map')
  , json = require('./routes/json')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('kDzRXXNU5RzKpLQsKWTxU4uX'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
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
    res.redirect('signin');
  }
}

app.get('/', routes.index);
app.get('/signin', signin.form);
app.post('/signin', signin.validate);
app.get('/map', restrict, map.index);
app.get('/json', restrict, json.retrieve);
app.post('/json', restrict, json.create);
app.put('/json/:id', restrict, json.update);
app.delete('/json/:id', restrict, json.delete);

app.set('mongodb', 'mongodb://localhost/rmmap');

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
