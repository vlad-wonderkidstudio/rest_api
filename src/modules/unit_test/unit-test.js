exports.getIndex = function() {
  return function(req, res) {
    res.setHeader('content-type', 'text/html');
    res.render('unit_test/unit-test.ect');
  };
};


exports.clearDB = function() {
	return function(req, res) {
    	_clearDB();
    	res.setHeader('content-type', 'application/json');
    	res.send({});
  	};
};

exports.clearRedis = function() {
	return function(req, res) {
    	_clearRedis();
    	res.setHeader('content-type', 'application/json');
    	res.send({});
  	};
};

exports.clearDBandRedis = function() {
	return function(req, res) {
		_clearRedis();
    	_clearDB();
    	res.setHeader('content-type', 'application/json');
    	res.send({});
  	};
};

function _clearDB(){
	for (var modelName in models) { 
		var Model = models[modelName];
		Model.remove({},function (err){
			log.line(err);
			if (err){
				var str = handleError(err);
				log.line (str);
			}
		});

	}
}

function _clearRedis(){
	redisClient.flushall();
}

function _createEmptyUser(){
	
}