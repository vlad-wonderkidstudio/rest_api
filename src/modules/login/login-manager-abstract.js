var DataStorageManager = require(config.modulesDir+ '/data_storage/data-storage-manager.js').DataStorageManager;

/*
* Create a new instance of LoginManagerAbstract
*/
function LoginManagerAbstract (){
	//LoginManagerAbstract.super_.call(this, "Login");
	this.mongoRDB = require (config.reposDir+ '/mongo-redis-auth-repository').init(mongoose, "Login"); 
  	this.emptyUUID = "00000000-0000-0000-0000-000000000000";	
}

//inheritance
util.inherits(LoginManagerAbstract, DataStorageManager);


/*
* Create a new instance of LoginManagerAbstract
*/
LoginManagerAbstract.prototype.createNewItem = function(obj, cb){
  
  log.line ("createNewItem"+obj);
  var dataStorage = this.prepareNewDataStorage(null);

  var additionalData = {
  	FullName: obj.FirstName+' '+obj.LastName,
  	DisplayName: obj.FirstName+' '+obj.LastName,
  };

  var finalObj = utils.mergeRecursive (obj, dataStorage );
  finalObj =  utils.mergeRecursive (finalObj, additionalData );

  this.mongoRDB.add(finalObj, function (err, item, numberAffected){
    if (err){
      log.line ("LoginManagerAbstract:add:err="+err);
    }else{
      //Do something

    }
    cb(err, item, numberAffected);
  });

}


/*
* Get an instance of LoginManagerAbstract
*/
LoginManagerAbstract.prototype.getItem = function(authToken, cb){
  if (!authToken) { return cb(true,null); }
  var params = {
        Active: true,
        Latest: true,
  };
  this.mongoRDB.getOne ( authToken, params, function (err, entity){
    cb(err,entity);
  });
}


/*
* Creates an object of class LoginManagerAbstract
* return the created object of class LoginManagerAbstract
*/
exports.init = function () {
 
  var loginManagerAbstract = new  LoginManagerAbstract (); 
  return loginManagerAbstract;
}


exports.LoginManagerAbstract = LoginManagerAbstract;