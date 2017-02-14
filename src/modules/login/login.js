var loginManager = require (config.modulesDir + '/login/login-manager-abstract.js').init();
var userAccountManager = require (config.modulesDir + '/user_account/user-account-manager-abstract.js').init();

//login
exports.login = function (){
	return function (req, res) {
		log.line ("check login"+req.body);
		var crypto = require('crypto');
		var obj = req.body;

		var passwordHash = crypto.createHash('md5').update(utils.salt+obj.password).digest('hex');
		
		//check log and pas
		userAccountManager.getItemByEmailAndPassword( obj.username, passwordHash, function (err, item){
			if (!err && item && item.EntityID) { //if such user exists
		        
		        var curTimeStr = new Date().toISOString();
		        //var authToken = utils.createUniqueString()+crypto.createHash('md5').update(curTimeStr).digest('hex');
		        var authTokenStr = obj.username+':'+passwordHash;
		        var authToken = new Buffer(authTokenStr).toString('base64');
		        
		        var authItem = {};
		        
		        authItem = utils.mergeRecursiveDBResult(authItem, item, "Password", 2);
		        authItem.AuthToken = authToken;
				authItem.UserEntityID = item.EntityID;
				
				//saving AuthToken
				loginManager.createNewItem(authItem, function(err, subItem, numberAffected){
					if (!err && subItem){
						//saved
						return res.send(201,prepareUserResult(subItem));
					}
					else{
						log.error('Login writing to DB/Redis error:'+err);
		        		return res.send(500); //login error		
					}
				});
		    } else { //wrong log and/or pas
		        log.error('Login error:'+err);
		        return res.send(401); //Unauthorized
		    }
		});
	}

}

/*
//check login auth
exports.checkLogin = function (cb){
	return function (req, res) {
		log.line ("check login"+req.body);
		
		var obj = req.body;	
		//var thisArguments = arguments;
		var req1 = req;
		var res1 = res;

		//check obj.AuthToken
		loginManager.getItem(obj.AuthToken, function(err,entity){
			if (!err && entity){
				//user exists
				global.currentUser = entity;
				//var cbb = cb();
				//log.line (cb.toString());
				//log.line (cbb);
				return cb(req1, res1);
			}
			else{
				log.error('Wrong Auth token');
		    	return res.send(401); //Unauthorized
			}
		});
	}
}
*/

exports.loginVerification = function(username,hashedPassword, cb){
/*	return cb (null, {  "AuthToken": "c3lzdGVtQGNvbm5lY3Rpb25wbGFubmVyLmNvbTozMTdGMUU3NjFGMkZBQThEQTc4MUE0NzYyQjlEQ0MyQzVDQUQyMDlB",
  "EntityID": "00000000-0000-0000-0000-000000000000",
  "FirstName": "System",
  "LastName": "Account",
  "Email": "system@inventoryoptix.com",
  "DisplayName": "System Account"});
*/
	log.line('loginVerification');
	//check log and pas
	userAccountManager.getItemByEmailAndPassword( username, hashedPassword, function (err, item){
		if (err){
			//log.line('loginVerificationErr');
			return cb(null,false);
		}
		else{
			//log.line('loginVerificationOk');
			currentLoggedInUser = item;
			return cb(null,item);
		}
	});

}

//LoginFail
//This is not part of the API, it is only here for front-end testing of login failures
exports.loginFail = function (){
	return function (req, res) {
		return res.send(200, null); 
		
	}

}


function prepareUserResult(item){
	var resItem = new Object;
	resItem.AuthToken = item.AuthToken;
	resItem.EntityID = item.UserEntityID;
	resItem.LastName = item.LastName;
	resItem.Email = item.Email;
	resItem.EmailHash = item.EmailHash;
	resItem.DisplayName = item.DisplayName;
	resItem.Password = item.HashedPassword;

	return resItem;
}