exports.index = function(req, res){
  res.render('index', { userid: req.session.userid });
};
