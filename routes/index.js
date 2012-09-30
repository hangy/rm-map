exports.index = function(req, res){
  if (req.session.userid && req.session.nick) {
    res.redirect('/map');
  } else {
    res.redirect('/signin');
  }
//   res.render('index', { title: 'Express', nick: req.session.nick });
};
