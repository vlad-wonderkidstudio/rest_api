
var DataStorageManager = require(config.modulesDir+ '/data_storage/data-storage-manager.js').DataStorageManager;
var crypto = require('crypto');

/*
* Create a new instance of VendorManagerAbstract
*/
function VendorManagerAbstract (){
	VendorManagerAbstract.super_.call(this, "Vendor");
}

//inheritance
util.inherits(VendorManagerAbstract, DataStorageManager);


/*
* Create a new instance of VendorManagerAbstract
*/
VendorManagerAbstract.prototype.createNewItem = function(obj, cb){
  
  log.line ("createNewItem"+obj);
  var self = this;

  //check If an active vendor with such email already exists
  this.getItemByEmail (obj.Email, function (err, entity){

      if (!err ){
        //vendor with such email exists
        return cb(true, "Vendor with such email already exists");
      }

      var dataStorage = self.prepareNewDataStorage();

      var additionalData = {
      	ChangedBy: currentLoggedInUser.DisplayName,
      	ChangedByID: currentLoggedInUser.EntityID,
      };

      var finalObj = utils.mergeRecursive (obj, dataStorage );
      finalObj =  utils.mergeRecursive (finalObj, additionalData );

      self.mongoRDB.add(finalObj, function (err, item, numberAffected){
        if (err){
          log.line ("VendorManagerAbstract:add:err="+err);
        }else{
          //Do something
        }
        cb(err, item, numberAffected);
      });
  });
}

/*
* Update an instance of VendorManagerAbstract
*/
VendorManagerAbstract.prototype.updateItem = function(obj, cb){
  var self = this;
	var additionalParams = {
  		ChangedBy: currentLoggedInUser.DisplayName,
      ChangedByID: currentLoggedInUser.EntityID,
      ChangedOn: Date.now(),
	}

  if (obj.Email){
    //check If an another active user with such email already exists
    this.getItemByEmailAndNotEntityID (obj.Email, obj.EntityID, function (err, entity){

      if (!err){
        //user with such email exists
        return cb(true, "Vendor with such email already exists");
      }else{
        obj = utils.mergeRecursive(obj, additionalParams);
        VendorManagerAbstract.super_.prototype.updateItem.call(self, obj, cb);  
        return;
      }
    });

  }else{
  	obj = utils.mergeRecursive(obj, additionalParams);
  	VendorManagerAbstract.super_.prototype.updateItem.call(this, obj, cb);
  }
}

/*
* Get an instance of active  DataStorage with different EntityID by Email
*calls cb(err,entity)
*/
VendorManagerAbstract.prototype.getItemByEmailAndNotEntityID = function(email, entityID, cb){
  var params = {
    Active: true,
    Latest: true,
    EntityID: {$ne: entityID},
    Email: email,

  };
  log.line(params);

  this.mongoRDB.getOne (params, function (err, entity){
    return cb(err, entity);
  });
}

/*
* Get an instance of active  DataStorage by Email 
*calls cb(err,entity)
*/
VendorManagerAbstract.prototype.getItemByEmail = function(email, cb){
  var params = {
    Active: true,
    Latest: true,
  };
  log.line(params);

  this.mongoRDB.getByEmail (email, params, function (err, entity){
    return cb(err, entity);
  });
}


/*
* Creates an object of class MongoRedisDataStorageRepository
* return the created object of class MongoRedisDataStorageRepository
*/
exports.init = function () {
  var vendorManagerAbstract = new  VendorManagerAbstract (); 
  return vendorManagerAbstract;
}


exports.VendorManagerAbstract = VendorManagerAbstract;