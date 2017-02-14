exports.getIndex = function() {
  return function(req, res) {
  	res.setHeader('content-type', 'text/html');
    res.render('root/root.ect');
  };
};
