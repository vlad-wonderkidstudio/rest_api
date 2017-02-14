/*
* require ('mongo-redis-repository') returns the MongoRedisRepository class
* require ('mongo-redis-repository').init(mongoose, modelName) returns an initialized object of the MongoRedisRepository class
*
*/



var MongoRepository = require('./mongo-repository.js').MongoRepository;


function MongoRedisRepository (mongoose, modelName)
{
	MongoRedisRepository.super_.apply(this, arguments);
}

//inheritance
util.inherits(MongoRedisRepository, MongoRepository);


 /*
 * create an entity item in MongoDB ans Redis
 * return is a call of cb(err)
 */
 MongoRedisRepository.prototype.add = function (entity, cb) {
    //var entity = new self.Model(obj);
	var entityS = JSON.stringify(entity);

	//save to Redis
	log.line (entity);
	log.line ("add:modelName="+entity.modelName);
	redisClient.hset(config.redisPrefix+entity.modelName, entity._id, entityS , redis.print );

    //finally save to DB
    MongoRedisRepository.super_.prototype.add.apply(this, arguments);

 };
 
 
 /*
 * update an entity item in MongoDB and Redis
 * return is a call of cb(err, numberAffected, raw)
 */  
 MongoRedisRepository.prototype.update = function (entity, cb) {

	var entityS = JSON.stringify(entity);
	var entityId = entity._id;

	log.line ("update:modelName="+entity.modelName);

	//Update to DB
	MongoRedisRepository.super_.prototype.update.call(this, entity, function (err,  numberAffected, raw) {
		if (err){ //if error
			cb(err);
		}else{ 
			//else save to REDIS
			redisClient.hset(config.redisPrefix+entity.modelName, entity._id, entityS , redis.print );
			cb (err,  numberAffected, raw);
		}

	});
 };

 /*
  * get an item from MongoDB or Redis by id
  * return is a call of cb(err, entity)
  */
MongoRedisRepository.prototype.getById = function (id, cb) {
	var self = this;
	
	//If already exists in Redis then
	redisClient.hget(config.redisPrefix+entity.modelName, id, function (err, res){
		if (err){ //the value is not in Redis, return from DB
			log.line ("getById:err"+res);	
			MongoRedisRepository.super_.prototype.getById.apply(self, arguments);

		}else{
			log.line ("getById:result"+res);
			cb(err, JSON.parse(res));
		}
	});
};

/*
* Creates an object of class MongoRedisRepository
* return the created object of class MongoRedisRepository
*/
exports.init = function (mongoose, modelName) {
 
  var mongoRedisRepository = new  MongoRedisRepository (mongoose, modelName); 
  return mongoRedisRepository;
}

exports.MongoRedisRepository = MongoRedisRepository; //Class defenition