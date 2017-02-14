

//Prototype Class for the DataStorageManager 
//storageName e.g. "DataStorageSchema"
function DataStorageManager(storageName){
  this.mongoRDB = require (config.reposDir+ '/mongo-redis-datastorage-repository').init(mongoose, storageName); 
  this.emptyUUID = "00000000-0000-0000-0000-000000000000";
  //var DataStorageSchema = models[storageName];


}

/*
* Create a new instance of DataStorage
*/
DataStorageManager.prototype.createNewItem = function(cb){
  //var DataStorageSchema = models.DataStorageSchema;
  var dataStorage = this.prepareNewDataStorage();

  this.mongoRDB.add(dataStorage, function (err, entity, numberAffected){
    if (err){
      log.line ("DataStorageManager:add:err="+err);
    }else{
      //Do something

    }
    cb(err, entity, numberAffected);
  });

}

/*
* Update an instance of DataStorage
*/
DataStorageManager.prototype.updateItem = function(obj, cb){
  var self = this;

  var conditions = {
    EntityID: obj.EntityID,
  }
  var update = {
    Latest: false,
    Active: false,
  }
  //get the full info for this user
  var params = {
        EntityID: obj.EntityID,
        Active: true,
        Latest: true,
  };
  self.mongoRDB.getById(obj.EntityID, params, function (err, entity1){
      var currentDataStorage;
      if (!err){
        log.line('not error');
        log.line('entity='+entity1);
        currentDataStorage = entity1;
      }else{
        log.line('ERR='+err);
        cb (err, entity1);
        return;
      }

      //If we change Email, then we delete an entity in Redis with previous email.
      if ((obj.Email) && (obj.Email != currentDataStorage.Email )){
        self.mongoRDB.deleteFromRedisByMail(currentDataStorage);
      }
  
      //update all the items with the same EntityID, so they are not active
      self.mongoRDB.updateMany  (conditions, update, function (err, numberAffected, raw){
        if (err) {cb (err); return;}
        var mergedDataStorage = new Object();
        if (currentDataStorage)  {
          var mergedDataStorage = utils.mergeRecursiveDBResult (mergedDataStorage, currentDataStorage, null , 2);
        }
        var dataStorage = self.prepareUpdatedDataStorage(obj);
        //var mergedDataStorage = utils.mergeRecursive (obj, dataStorage);
        var mergedDataStorage = utils.mergeRecursive (mergedDataStorage, obj,2);
        var mergedDataStorage = utils.mergeRecursive (mergedDataStorage, dataStorage,2);
        log.line('before=');
          log.line(currentDataStorage);
        
        log.line('after=');
        log.line(mergedDataStorage);
        //Add an active item with this EntityID
        self.mongoRDB.add(mergedDataStorage, function (err, entity2, numberAffected){
          if (err){
            log.line ("DataStorageManager:update:err="+err);
          }else{
            //Do something
          }
          cb (err, entity2, numberAffected);
        });
      });

  });
}

/*
* Get an instance of DataStorage
*/
DataStorageManager.prototype.getItem = function(entityID, cb){
  var params = {
        EntityID: entityID,
        Active: true,
        Latest: true,
  };
  this.mongoRDB.getById ( entityID, params, function (err, entity){
    cb(err,entity);
  });
}

/*
* Get an instance of deleted DataStorage
*/
DataStorageManager.prototype.getDeletedItem = function(entityID, cb){
  var params = {
        EntityID: entityID,
        Active: false,
        Latest: true,
  };
  this.mongoRDB.getById ( entityID, params, function (err, entity){
    cb(err,entity);
  });
}

/*
* Get an instance  DataStorage by EntityID and Version
*/
DataStorageManager.prototype.getItemByEntityAndVersion = function(entityID, versionID, cb){
  var params = {
    EntityID: entityID,
    VersionID: versionID,
  };
  this.mongoRDB.getOne ( params, function (err, entity){
    cb(err,entity);
  });
}



/*
* Get all instances of DataStorage
*/
DataStorageManager.prototype.getAllItems = function(cb){
  var params = {
        Active: true,
        Latest: true,
  };
  this.mongoRDB.getList  (params, cb);
}

/*
* Delete a DataStorage instance
*/
DataStorageManager.prototype.removeItem = function(entityID, cb){
  log.line('removeItem');
  var condition = {
    EntityID: entityID,
  }
  var updateto = {
    Active: false,
  }
  var self = this;
  this.mongoRDB.updateMany ( condition, updateto, function (numberAffected, raw){
    log.line('removeItem-removeFromRedis');
    self.mongoRDB.removeFromRedis  (entityID, cb);
  });

  
}



/*
* Prepare new DataStorage object
*/
DataStorageManager.prototype.prepareNewDataStorage = function (){
  //set default values
  var id = uuid.v1() 
  var dataStorage = {
    _id : id,
    EntityID: id,
    Version: uuid.v1(),
    PreviousVersion: this.emptyUUID,
    Active: true,
    Latest: true,
    //ChangedByID: currentLoggedInUser.EntityID,
    //ChangedBy: currentLoggedInUser.DisplayName,
  };
  if (currentLoggedInUser){
    dataStorage.ChangedByID = currentLoggedInUser.EntityID;
    dataStorage.ChangedBy = currentLoggedInUser.DisplayName;
  }

  return dataStorage;
}

/*
* Prepare updated DataStorage object
*/
DataStorageManager.prototype.prepareUpdatedDataStorage = function (obj){
  var dataStorage = this.prepareNewDataStorage ();

  //set not-default values
  var updatedFields = {
    EntityID: obj.EntityID,
    PreviousVersion: obj.Version,
  }

  dataStorage = utils.mergeRecursive(dataStorage,updatedFields,2);
    
  return dataStorage;
}



exports.DataStorageManager = DataStorageManager; //Class defenition