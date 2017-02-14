var userAccountManager = require ('./user-account-manager-abstract.js').init();

//get all items
exports.getAllUserAccounts = function (){
	return function (req, res) {
		log.line ("getAllUserAccounts");
		userAccountManager.getAllItems(function (err, itemsA){
			if (err){
				log.error(err);
				return res.send(500); //some unexpected error
			}else{
				return res.send(200, prepareUsersResults(itemsA)); //return the list
			}
		});
	}
}


//get single item
exports.getUserAccount = function (){
	return function (req, res) {
		log.line ("getUserAccount");
		var entityID = req.params[0];
		log.line ('entityID='+entityID);
		userAccountManager.getItem( entityID, function (err, item){
			if ((!err)&&(item)) {
		        res.set({
		                  'X-My-Header': 'The Value',
		                });
		        return res.send(200, prepareUserResult(item)); //found and return it now
		    } else {
		        log.error(err);
		        return res.send(404, 'NOT FOUND');
		    }
		});
	}

}

//create account
exports.createUserAccount = function (){
	return function (req, res) {
		log.line ("createUserAccount"+req.body);
		
		var obj = req.body;
		
		userAccountManager.createNewItem( obj, function (err, item){
			if (!err) {
		        log.line("created1");
		        log.line(item);
		        log.line("created2");
		        return res.send(201,prepareUserResult(item)); //created
		    } else {
		        log.error(err);
		        if (item) {
		        	var errStr = item;
		        	return res.send(409,errStr);	
		        }
		        return res.send(500); //some unexpected error
		    }
		});
	}
}

//update account
exports.updateUserAccount = function (){
	return function (req, res) {
		log.line ("updateUserAccount");
		
		var obj = req.body;
		
		userAccountManager.updateItem( obj, function (err, item){
			if (!err) {
	          log.line("updated");
	          log.line(item);
	          return res.send(200, prepareUserResult(item)); //updated sucessfully
	        } else {
	          	if (item) {
		        	var errStr = item;
		        	return res.send(409,errStr);	
		        }
	          //return res.send(500); //some unexpected error
	          return res.send(404, 'NOT FOUND');
			}
		});
	}

}


//delete account
exports.deleteUserAccount = function (){
	return function (req, res) {
		log.line ("deleteUserAccount");
		var entityID = req.params[0];
		
		userAccountManager.removeItem( entityID, function (err, item){
			if (!err) {
		        log.line("removed");
		        return res.send(204);
		    } else {
		        log.line(err);
		        return res.send(500); //some unexpected error
		    }
		});
	}
}





//----------------internal functions
 
//Prepare the array with results for the output
function prepareUsersResults(itemsA){
    var resultingArray = new Array();
    itemsA.forEach(function (item){
    	//log.info('before');
      	resultingArray[resultingArray.length] = prepareUserResult(utils.prepareDBResultEntity(item));
      	//log.info('after');
    });
    return resultingArray;
}

//prepare the result, which we will show to the end user
function prepareUserResult(item){
    var publicItem = new Object();
    if (item){
	   	publicItem	= utils.mergeRecursiveDBResult(publicItem,item, ["Password"], 2);
    }
    log.line(publicItem);
    return publicItem;
}

