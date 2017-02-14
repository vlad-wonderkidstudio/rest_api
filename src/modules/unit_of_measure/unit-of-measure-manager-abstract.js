
var DataStorageManager = require(config.modulesDir+ '/data_storage/data-storage-manager.js').DataStorageManager;
var crypto = require('crypto');

/*
* Create a new instance of UnitOfMeasureManagerAbstract
*/
function UnitOfMeasureManagerAbstract (){
	UnitOfMeasureManagerAbstract.super_.call(this, "UnitOfMeasure");
}

//inheritance
util.inherits(UnitOfMeasureManagerAbstract, DataStorageManager);


/*
* Create a new instance of UnitOfMeasureManagerAbstract
*/
UnitOfMeasureManagerAbstract.prototype.createNewItem = function(obj, cb){
  
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
      if (obj.Abbreviation){ //name and abbreviation
        checkAbbreviation();
      }else{
        doCreate();
      }
    });
  }else{ //no name, only abbreviation
    if (obj.Abbreviation){
      checkAbbreviation();
    }else{ //no name and no abbreviation
      doCreate();
    }
  }
  //create item to DB and Redis
  function doCreate(){
    log.line('doCreate');
    self.mongoRDB.add(finalObj, function (err, item, numberAffected){
      if (err){
        log.line ("UnitOfMeasureManagerAbstract:add:err="+err);
      }else{
        //Do something
      }
      cb(err, item, numberAffected);
    });  
  }

  //Check if an item with the same Abbreviation already exists - if exists, then return an error
  function checkAbbreviation(){
    self.getItemByAbbreviation(obj.Abbreviation, function (err, entity){
      if (!err){
        //An active object with the same Abbreviation already exists
        cb(true,"An active object with the same Abbreviation already exists");
        return;
      }
      //The Name and Abbreviation are unique - lets save
      log.line('before doCreate');
      doCreate();
    });
    
  }

}

/*
* Update an instance of UnitOfMeasureManagerAbstract
*/
UnitOfMeasureManagerAbstract.prototype.updateItem = function( obj, cb){
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
        if (obj.Abbreviation){ //name and abbreviation
          checkAbbreviation();
        }else{
          doUpdate();
        }
      });
    }else{ //no name, only abbreviation
      if (obj.Abbreviation){
        checkAbbreviation();
      }else{ //no name and no abbreviation
        doUpdate();
      }
    }
	

  //update to DB and Redis
  function doUpdate(){
    UnitOfMeasureManagerAbstract.super_.prototype.updateItem.call(self, obj, cb);
  }

  //Check if an item with the same Abbreviation already exists - if exists, then return an error
  function checkAbbreviation(){
    self.getItemByAbbreviation(obj.Abbreviation, function (err, entity){
      if ((!err)&&(entity.EntityID != obj.EntityID)){
        //An active object with the same Abbreviation already exists  (and it is not the same object)
        cb(true,"An active object with the same Abbreviation already exists");
        return;
      }
      //The Name and Abbreviation are unique - lets save
      doUpdate();
    });
    
  }
}

/*
* Get an instance of active  DataStorage by Name 
*calls cb(err,entity)
*/
UnitOfMeasureManagerAbstract.prototype.getItemByName = function(name, cb){
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
* Get an instance of active  DataStorage by Abbreviation 
*calls cb(err,entity)
*/
UnitOfMeasureManagerAbstract.prototype.getItemByAbbreviation = function(abbreviation, cb){
  var params = {
    Active: true,
    Latest: true,
    Abbreviation: abbreviation,
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
  var unitOfMeasureManagerAbstract = new  UnitOfMeasureManagerAbstract (); 
  return unitOfMeasureManagerAbstract;
}


exports.UnitOfMeasureManagerAbstract = UnitOfMeasureManagerAbstract;