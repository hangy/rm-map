var login = require('rm-login');

exports.form = function(req, res){
 res.render('signin');
};

exports.validate = function(req, res){
 login(req.body.email, req.body.password, function(userid, nick){
  if (userid && nick) {
   req.session.regenerate(function(){
    req.session.userid = userid;
    req.session.nick = nick;
    res.redirect('index');
   });
  } else {
   res.render('signin');
  }
 });
};
