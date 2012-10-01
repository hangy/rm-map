var login = require('rm-login');

exports.validate = function(req, res){
 login(req, req.body.email, req.body.password, function(userid, nick){
  if (userid && nick) {
   req.session.regenerate(function(){
    req.session.userid = userid;
    req.session.nick = nick;
    res.json(200, { userid: userid, nick: nick });
   });
  } else {
    res.json(500, { userid: userid, nick: nick });
  }
 });
};
