
var DataStorageManager = require(config.modulesDir+ '/data_storage/data-storage-manager.js').DataStorageManager;
var crypto = require('crypto');

/*
* Create a new instance of CategoryManagerAbstract
*/
function CategoryManagerAbstract (){
	CategoryManagerAbstract.super_.call(this, "Category");
}

//inheritance
util.inherits(CategoryManagerAbstract, DataStorageManager);


/*
* Create a new instance of CategoryManagerAbstract
*/
CategoryManagerAbstract.prototype.createNewItem = function(obj, cb){
  
  log.line ("createNewItem"+obj);
  var self = this;

  
  var dataStorage = self.prepareNewDataStorage();

  var additionalData = {
  	ChangedBy: currentLoggedInUser.DisplayName,
  	ChangedByID: currentLoggedInUser.EntityID,
  };

  var finalObj = utils.mergeRecursive (obj, dataStorage );
  finalObj =  utils.mergeRecursive (finalObj, additionalData );

  if (obj.Name){
    self.getItemByName(obj.Name, function (err, entity){
      if (!err){
        //An active object with the same Name already exists
        cb(true,"An active object with the same Name already exists");
        return;
      }
      doCreate();
    });
  }else{ //no name, only abbreviation
    doCreate();
  }

  function doCreate(){
    self.mongoRDB.add(finalObj, function (err, item, numberAffected){
      if (err){
        log.line ("CategoryManagerAbstract:add:err="+err);
      }else{
        //Do something
      }
      cb(err, item, numberAffected);
    });
  } 

}

/*
* Update an instance of CategoryManagerAbstract
*/
CategoryManagerAbstract.prototype.updateItem = function( obj, cb){
	var self = this;
  var additionalParams = {
  		ChangedBy: currentLoggedInUser.DisplayName,
      ChangedByID: currentLoggedInUser.EntityID,
      ChangedOn: Date.now(),
	}

	obj = utils.mergeRecursive(obj, additionalParams);

  if (obj.Name){
    self.getItemByName(obj.Name, function (err, entity){
      if ((!err)&&(entity.EntityID != obj.EntityID)){
        //An active object with the same Name already exists (and it is not the same object)
        cb(true,"An active object with the same Name already exists");
        return;
      }
      doUpdate();
    });
  }else{ //no name, only abbreviation
      doUpdate();
  }

	//update to DB and Redis
  function doUpdate(){
    CategoryManagerAbstract.super_.prototype.updateItem.call(self, obj, cb);
  }
}

/*
* Get an instance of active  DataStorage by Name 
*calls cb(err,entity)
*/
CategoryManagerAbstract.prototype.getItemByName = function(name, cb){
  var params = {
    Active: true,
    Latest: true,
    Name: name,
  };
  log.line(params);

  this.mongoRDB.getOne (params, function (err, entity){
    return cb(err, entity);
  });
}


/*
* Creates an object of class MongoRedisDataStorageRepository
* return the created object of class MongoRedisDataStorageRepository
*/
exports.init = function () {
  var categoryManagerAbstract = new  CategoryManagerAbstract (); 
  return categoryManagerAbstract;
}


exports.CategoryManagerAbstract = CategoryManagerAbstract;