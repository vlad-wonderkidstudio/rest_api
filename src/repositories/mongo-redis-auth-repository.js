var MongoRepository = require('./mongo-repository.js').MongoRepository;
//log.info ('MongoRepository'+MongoRepository);

function MongoRedisAuthRepository (mongoose, modelName)
{
	MongoRedisAuthRepository.super_.apply(this, arguments);
}

//inheritance
util.inherits(MongoRedisAuthRepository, MongoRepository);

/*
 * create an entity item in MongoDB ans Redis
 * return is a call of cb(err)
 */
 MongoRedisAuthRepository.prototype.add = function (obj, cb) {
    log.line('auth add');
    log.line(obj);

    var entity = new this.Model(obj);
	var entityS = JSON.stringify(obj);	

	//save to Redis
	var keyName = config.redisPrefix+this.Model.modelName; //+':'+entity.EntityID;
	var fieldName = entity.AuthToken;
	log.line ("auth add:keyName="+keyName);
	redisClient.hset(keyName, fieldName, entityS , redis.print );

    //finally save to DB
    MongoRedisAuthRepository.super_.prototype.add.apply(this, arguments);

 };

 /*
  * get an item from MongoDB or Redis by AuthToken
  * return is a call of cb(err, entity)
  */
MongoRedisAuthRepository.prototype.getOne = function ( authToken, params, cb) {
	//log.line(this.Model);
	var keyName = config.redisPrefix+this.Model.modelName;
	var fieldName = authToken;
	var self = this;

	log.line ("getById:keyName="+keyName);
	//If already exists in Redis then
	redisClient.hget(keyName, fieldName, function (err, res){
		//var err=1; //uncomment to test it with Redis turned off
		if (err || !res ){ //the value is not in Redis, return from DB
			log.line ("getById:err"+err+':'+fieldName);	
			
			params.AuthToken = authToken;
			log.line(params);
			MongoRedisAuthRepository.super_.prototype.getOne.call(self, params, cb);

		}else{
			var resO = JSON.parse(res);
			log.line ("getById:result");
			log.line (resO);
			
			//small time format hack
			var timeOnChange = new Date(resO.ChangedOn);
			resO.ChangedOn = timeOnChange.toISOString();
			cb(err, resO);
		}
	});
};


/*
* Creates an object of class MongoRedisAuthRepository
* return the created object of class MongoRedisAuthRepository
*/
exports.init = function (mongoose, modelName) {
 
  var mongoRedisAuthRepository = new  MongoRedisAuthRepository (mongoose, modelName); 
  return mongoRedisAuthRepository;
}

exports.MongoRedisAuthRepository = MongoRedisAuthRepository; //Class defenition