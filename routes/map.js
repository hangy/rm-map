exports.index = function(req, res){
  res.render('map', { userid: req.session.userid });
};
