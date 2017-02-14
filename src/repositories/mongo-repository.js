/*
* require ('mongo-repository') returns the MongoRepository class
* require ('mongo-repository').init(mongoose, modelName) returns an initialized object of the MongoRepository class
*
*/


function MongoRepository (mongoose, modelName) {
   this.Model = models[modelName]; 
 }

  /*
  * create an entity item in MongoDB
  * return is a call of cb(err)
  */
  MongoRepository.prototype.add = function (obj, cb) {
    //var entity = new self.Model(obj);
    log.line('MongoRepository.add: ');
    //log.line('obj=');
    log.line(obj);
    var entity = new this.Model(obj);
    //log.line('model='+modelName);
    //log.line('modelC=');
    //log.line(this.Model);
    //log.line('entity=');
    //log.line(entity);
    entity.save(function (err, entity, numberAffected) {
      var resObj = utils.prepareDBResultEntity(entity);
      log.line(utils.prepareDBResultEntity(entity));
      cb(err, resObj , numberAffected);
    });
  };
 

  /*
  * update an entity item in MongoDB
  * return is a call of cb(err, numberAffected, entity)
  */  
  MongoRepository.prototype.update = function (entity, cb) {
    
    this.Model.findById(entity.id, function (err, oldEntity) {
      if (err) {
        cb(err);
      } else {

          oldEntity = utils.mergeRecursive(utils.prepareDBResultEntity(oldEntity), entity);
          oldEntity.save(function (err){
            cb(err, 1, utils.prepareDBResultEntity(oldEntity));
          });
      }
    })
  };

  /*
  * get an item from MongoDB by id
  * return is a call of cb(err, resultObj)
  */
 MongoRepository.prototype.getById = function (id, cb) {
    this.Model.findById( id, function(err, entity) {
      
      cb(err, utils.prepareDBResultEntity(entity));
    });
  };
 
  /*
  * get an item from MongoDB by params
  * return is a call of cb(err, entity)
  */
  MongoRepository.prototype.getOne = function (params, cb) {
    var Model = this.Model;
    log.line ('getOne');
    log.line (params);
    Model.findOne(params, function (err, entity) {
      if (!err && !entity) {
        err = true;
      }
      cb(err, utils.prepareDBResultEntity(entity));
    });
  };


  /*
  * get items from MongoDB by params
  * return is a call of cb(err, entities)
  */
  MongoRepository.prototype.getList = function (params, cb, lean) {
    
    if (!lean) {
        this.Model.find(params).exec(cb);
    } else {
        this.Model.find(params).lean().exec(cb);
    }
  };
 

 
  /*
  * delete an entity item in MongoDB
  * return is a call of cb(err)
  */
  MongoRepository.prototype.delete = function (obj, cb) {
    var entity = new this.Model(obj);
    entity.remove(function (err) {
      cb(err);
    });
  };
 

 
/*
* Creates an object of class MongoRepository
* return the created object of class MongoRepository
*/
exports.init = function (mongoose, modelName) {
 
  var mongoRepository = new  MongoRepository (mongoose, modelName); 
  return mongoRepository;
}

exports.MongoRepository = MongoRepository; //Class defenition