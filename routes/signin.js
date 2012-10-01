var login = require('rm-login');

exports.form = function(req, res){
 req.session.regenerate(function(){
  res.render('signin', { email: '' });
 });
};

exports.validate = function(req, res){
 login(req, req.body.email, req.body.password, function(userid, nick){
  if (userid && nick) {
   req.session.regenerate(function(){
    req.session.userid = userid;
    req.session.nick = nick;
    res.redirect('/');
   });
  } else {
   res.render('signin', { email: req.body.email });
  }
 });
};
