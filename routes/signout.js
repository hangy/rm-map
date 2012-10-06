exports.index = function(req, res){
 req.session.regenerate(function(){
  res.redirect('..');
 });
};
