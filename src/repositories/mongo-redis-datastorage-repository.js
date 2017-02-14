/*
* require ('mongo-redis-repository') returns the MongoRedisDataStorageRepository class
* require ('mongo-redis-repository').init(mongoose, modelName) returns an initialized object of the MongoRedisDataStorageRepository class
*
*/



var MongoRepository = require('./mongo-repository.js').MongoRepository;
//log.info ('MongoRepository'+MongoRepository);

function MongoRedisDataStorageRepository (mongoose, modelName)
{
	MongoRedisDataStorageRepository.super_.apply(this, arguments);
}

//inheritance
util.inherits(MongoRedisDataStorageRepository, MongoRepository);


 /*
 * create an entity item in MongoDB ans Redis
 * return is a call of cb(err)
 */
 MongoRedisDataStorageRepository.prototype.add = function (obj, cb) {
	var self = this;    
    log.line('add');
    log.line(obj);

    var entity = new this.Model(obj);

    var entityObj = utils.prepareDBResultEntity (entity);
    //save to DB
    ////MongoRedisDataStorageRepository.super_.prototype.add.apply(this, arguments);
    MongoRedisDataStorageRepository.super_.prototype.add.call(this, entity,  function (err, resObj , numberAffected){
    	if (err) {}
    	else{
	    	//finally save to REDIS
	    	self.saveToRedis(entityObj, self.Model.modelName);
			self.saveToRedisByMail(entityObj, self.Model.modelName);	
		}
		cb (err, resObj , numberAffected);
    });

 };
 
 
 /*
 * update an entity item in MongoDB and Redis
 * return is a call of cb(err, numberAffected, raw)
 */  
MongoRedisDataStorageRepository.prototype.update = function (obj, cb) {

	/*
	var entity = new this.Model(obj);
	var entityS = JSON.stringify(obj);

	var keyName = config.redisPrefix+this.Model.modelName; //+':'+entity.EntityID;
	var fieldName = obj.EntityID;
	log.line ("update:keyName="+keyName);
	*/
	var self = this;

	//Update to DB
	MongoRedisDataStorageRepository.super_.prototype.update.call(this, entity, function (err,  numberAffected, newEntity) {
		if (err){ //if error
			cb(err);
		}else{ 
			//else save to REDIS
			//var entityObj = utils.prepareDBResultEntity(entity);
			log.line("Update to DB");
			log.line(newEntity);
			self.saveToRedis(newEntity, self.Model.modelName);
			self.saveToRedisByMail(newEntity, self.Model.modelName);
			
			cb (err,  numberAffected, newEntity);
		}

	});
 };

 /*
 * update entities in MongoDB and Redis
 * return is a call of cb(err, numberAffected, raw)
 */  
MongoRedisDataStorageRepository.prototype.updateMany = function (conditions, update, cb) {
	var self = this;
	this.Model.update(conditions, update, { multi: true }, function (err, numberAffected, raw) {
  		if (err) { cb(err); return; }
  		/*
  		//if no error, then get the list of affected items from Redis and update them accordingly
  		self.getList(conditions, function (err,itemsA){
  			
  			if (err) { cb(err); return; } //donothing

  			var i = 0;
  			itemsA.forEach(function (item){
      			//resultingArray[resultingArray.length] = prepareNoteResult(note);
      			var entityS = JSON.stringify(item);
      			var keyName = config.redisPrefix+this.Model.modelName; //+':'+entity.EntityID;
				var fieldName = entity.EntityID;
				log.line ("updateMany:keyName:"+i+"="+keyName);
				redisClient.hset(keyName, fieldName, entityS , redis.print );
				i++;
    		});

    		//finally
    		cb(err, numberAffected, raw);
  		}*/
  		//finally
    	cb(err, numberAffected, raw);
  		
	});
}

 /*
  * get an item from MongoDB or Redis by id
  * return is a call of cb(err, entity)
  */
MongoRedisDataStorageRepository.prototype.getById = function ( entityID, params, cb) {
	var keyName = config.redisPrefix+this.Model.modelName;
	var fieldName = entityID;
	var self = this;

	log.line ("getById:keyName="+keyName);
	//If already exists in Redis then
	redisClient.hget(keyName, fieldName, function (err, res){
		//var err=1; //uncomment to test it with Redis turned off
		if (err || !res ){ //the value is not in Redis, return from DB
			log.line ("getById:err"+err+':'+fieldName);	
			params.EntityID = entityID;
			log.line(params);
			MongoRedisDataStorageRepository.super_.prototype.getOne.call(self, params, function(err,entity){
				//need to write it to Redis, since it is absent there
				if (!err && entity){
					self.saveToRedis(entity, self.Model.modelName);
					self.saveToRedisByMail(entity, self.Model.modelName);
				}
				cb(err,entity);
			});

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
  * get an item from MongoDB or Redis by id
  * return is a call of cb(err, entity)
  */
MongoRedisDataStorageRepository.prototype.getByEmail = function ( email, params, cb) {
	var keyName = config.redisPrefix+this.Model.modelName+':email';
	var fieldName = email;
	var self = this;

	log.line ("getByEmail:keyName="+keyName);
	//If already exists in Redis then
	redisClient.hget(keyName, fieldName, function (err, res){
		//var err=1; //uncomment to test it with Redis turned off
		if (err || !res ){ //the value is not in Redis, return from DB
			log.line ("getById:err"+err+':'+fieldName);	
			params.Email = email;			
			log.line(params);
			MongoRedisDataStorageRepository.super_.prototype.getOne.call(self, params, function(err,entity){
				//need to write it to Redis, since it is absent there
				log.line(err);
				log.line(entity);
				if (!err && entity){
					self.saveToRedis(entity, self.Model.modelName);
					self.saveToRedisByMail(entity, self.Model.modelName);
				}
				cb(err,entity);
			});

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
  * get one item from MongoDB or Redis
  * return is a call of cb(err, entity)
 */
/*  
MongoRedisDataStorageRepository.prototype.getOne = function ( params, cb) {
	
	log.line ("getById:err"+res);	
	
	MongoRedisDataStorageRepository.super_.prototype.getOne.call(this, params, cb);
};
*/

 /*
  * get an item from MongoDB or Redis by id
  * return is a call of cb(err, entity)
  */
MongoRedisDataStorageRepository.prototype.removeFromRedis = function ( entityID, cb) {
	//remove by entityID
	var keyName = config.redisPrefix+this.Model.modelName;
	var fieldName = entityID;
	var self = this;

	log.line('removeFromRedis');
	log.line('keyName='+keyName);
	log.line('fieldName='+fieldName);
	redisClient.hdel(keyName, fieldName, cb);

	//remove by Email
	var params = {
        EntityID: entityID,
        Latest: true,
  	};
	this.getById(entityID, params, function (err, entity1){
      	if (!err){
       		var keyName = config.redisPrefix+self.Model.modelName+':email';
			var fieldName = entity1.Email; 
			log.line('removeFromRedis');
			log.line('keyName='+keyName);
			log.line('fieldName='+fieldName);
			if (fieldName){
				redisClient.hdel(keyName, fieldName);			
			}
      	}else{
        	//do nothing
      	}
    });


}

/*
* Save to REDIS
*/
MongoRedisDataStorageRepository.prototype.saveToRedis = function (entity, modelName){
	//we save to Redis only Latest and Active
	if (!entity.Active || !entity.Latest) {return;}
	if (!modelName) {modelName = this.Model.modelName; }
	var entityS = JSON.stringify(entity);		
	var keyName = config.redisPrefix+modelName; 
	var fieldName = entity.EntityID;
	log.line ("saveToRedis:keyName="+keyName+'##fieldName='+fieldName);
	redisClient.hset(keyName, fieldName, entityS , redis.print );

}
/*
* Save to REDIS by Mail
*/
MongoRedisDataStorageRepository.prototype.saveToRedisByMail = function (entity, modelName){
	//we save to Redis only Latest and Active
	if (!entity.Active || !entity.Latest) {return;}
	if (!modelName) {modelName = this.Model.modelName; }
	var entityS = JSON.stringify(entity);		
	var keyName = config.redisPrefix+modelName+':email';
	var fieldName = entity.Email;
	log.line ("saveToRedisByMail:keyName="+keyName+'##fieldName='+fieldName);
	redisClient.hset(keyName, fieldName, entityS , redis.print );
}
/*
* Delete from REDIS by Mail
*/
MongoRedisDataStorageRepository.prototype.deleteFromRedisByMail = function (entity, modelName){
	//we save to Redis only Latest and Active
	if (!entity.Active || !entity.Latest) {return;}
	if (!modelName) {modelName = this.Model.modelName; }
	var entityS = JSON.stringify(entity);		
	var keyName = config.redisPrefix+modelName+':email';
	var fieldName = entity.Email;
	log.line ("deleteFromRedisByMail:keyName="+keyName+'##fieldName='+fieldName);
	redisClient.hdel(keyName, fieldName);			
}

/*
* Creates an object of class MongoRedisDataStorageRepository
* return the created object of class MongoRedisDataStorageRepository
*/
exports.init = function (mongoose, modelName) {
 
  var mongoRedisDataStorageRepository = new  MongoRedisDataStorageRepository (mongoose, modelName); 
  return mongoRedisDataStorageRepository;
}

exports.MongoRedisDataStorageRepository = MongoRedisDataStorageRepository; //Class defenition