
var DataStorageManager = require(config.modulesDir+ '/data_storage/data-storage-manager.js').DataStorageManager;
var crypto = require('crypto');

/*
* Create a new instance of UserAccountManagerAbstract
*/
function UserAccountManagerAbstract (){
	UserAccountManagerAbstract.super_.call(this, "UserAccount");
}

//inheritance
util.inherits(UserAccountManagerAbstract, DataStorageManager);


/*
* Create a new instance of UserAccountManagerAbstract
*/
UserAccountManagerAbstract.prototype.createNewItem = function( obj, cb){
  
  log.line ("createNewItem"+obj);
  var self = this;

  //check If an active user with such email already exists
  this.getItemByEmail (obj.Email, function (err, entity){

      if (!err ){
        //user with such email exists
        return cb(true, "User with such email already exists");
      }

      var dataStorage = self.prepareNewDataStorage();

      var additionalData = {
      	EmailHash: crypto.createHash('md5').update(utils.salt+obj.Email).digest('hex'),
      	HashedPassword:  crypto.createHash('md5').update(utils.salt+obj.Password).digest('hex'),
      	FullName: obj.FirstName+' '+obj.LastName,
      	DisplayName: obj.FirstName+' '+obj.LastName,
      	ChangedBy: currentLoggedInUser.DisplayName,
      	ChangedByID: currentLoggedInUser.EntityID,
      };

      var finalObj = utils.mergeRecursive (obj, dataStorage );
      finalObj =  utils.mergeRecursive (finalObj, additionalData );

      self.mongoRDB.add(finalObj, function (err, product, numberAffected){
        if (err){
          log.line ("UserAccountManagerAbstract:add:err="+err);
        }else{
          //Do something
        }
        cb(err, product, numberAffected);
      });
  });
}

/*
* Update an instance of UserAccountManagerAbstract
*/
UserAccountManagerAbstract.prototype.updateItem = function(obj, cb){
  var self = this;
	var additionalParams = {
  		ChangedBy: currentLoggedInUser.DisplayName,
      ChangedByID: currentLoggedInUser.EntityID,
      ChangedOn: Date.now(),
	}
  //update hash, if a new value was provided
  if (obj.Email){
    obj.EmailHash = crypto.createHash('md5').update(utils.salt+obj.Email).digest('hex');
  }
  if (obj.Password){
    obj.HashedPassword = crypto.createHash('md5').update(utils.salt+obj.Password).digest('hex');
  }

  if (obj.Email){
    //check If an another active user with such email already exists
    this.getItemByEmailAndNotEntityID (obj.Email, obj.EntityID, function (err, entity){

      if (!err){
        //user with such email exists
        return cb(true, "User with such email already exists");
      }else{
        obj = utils.mergeRecursive(obj, additionalParams);
        UserAccountManagerAbstract.super_.prototype.updateItem.call(self, obj, cb);  
        return;
      }
    });

  }else{
    obj = utils.mergeRecursive(obj, additionalParams);
    UserAccountManagerAbstract.super_.prototype.updateItem.call(this, obj, cb);  
  }
	
}

/*
* Get an instance of active  DataStorage with different EntityID by Email
*calls cb(err,entity)
*/
UserAccountManagerAbstract.prototype.getItemByEmailAndNotEntityID = function(email, entityID, cb){
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
UserAccountManagerAbstract.prototype.getItemByEmail = function(email, cb){
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
* Get an instance of active  DataStorage by Email and Password
*calls cb(err,entity)
*if err is false, then Email and Password are correct
*/
UserAccountManagerAbstract.prototype.getItemByEmailAndPassword = function(email, hashedPassword, cb){
  log.line('getItemByEmailAndPassword');
  this.getItemByEmail (email, function (err, entity){
    if (err){ //error while reading DB or Redis
      return cb(err, entity);
    }
    else{
      log.line(entity);
      log.line(hashedPassword);
      if (entity.HashedPassword == hashedPassword)
      {
        log.line('matched');
        //Log&Pas matched
        return cb(false,entity);  
      }
      else{ 
        log.line('not matched');
        return cb(true, entity); //Log&Pas does not match 
      }
    }
  });
}

/*
* Creates an object of class MongoRedisDataStorageRepository
* return the created object of class MongoRedisDataStorageRepository
*/
exports.init = function () {
  var userAccountManagerAbdtract = new  UserAccountManagerAbstract (); 
  return userAccountManagerAbdtract;
}


exports.UserAccountManagerAbstract = UserAccountManagerAbstract;