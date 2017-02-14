var vendorManager = require ('./vendor-manager-abstract.js').init();

//get all items
exports.getAllVendors = function (){
	return function (req, res) {
		log.line ("getAllVendors");
		vendorManager.getAllItems(function (err, itemsA){
			if (err){
				log.error(err);
				return res.send(500); //some unexpected error
			}else{
				return res.send(200, prepareVendorsResults(itemsA)); //return the list
			}
		});
	}
}


//get single item
exports.getVendor = function (){
	return function (req, res) {
		log.line ("getVendor");
		var entityID = req.params[0];
		log.line ('entityID='+entityID);
		vendorManager.getItem( entityID, function (err, item){
			if ((!err)&&(item)) {
		        res.set({
		                  'X-My-Header': 'The Value',
		                });
		        return res.send(200, prepareVendorResult(item)); //found and return it now
		    } else {
		        log.error(err);
		        return res.send(404, 'NOT FOUND');
		    }
		});
	}
}

//create account
exports.createVendor = function (){
	return function (req, res) {
		log.line ("createVendor"+req.body);
		
		var obj = req.body;
		var currentVendorId = obj.EntityID;

		vendorManager.createNewItem( obj, function (err, item){
			if (!err) {
		        log.line("vendor created1");
		        log.line(item);
		        log.line("vendor created2");
		        return res.send(201,prepareVendorResult(item)); //created
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
exports.updateVendor = function (){
	return function (req, res) {
		log.line ("updateVendor");
		
		var obj = req.body;
		
		vendorManager.updateItem( obj, function (err, item){
			if (!err) {
	          log.line("updated");
	          log.line(item);
	          return res.send(200, prepareVendorResult(item)); //updated sucessfully
	        } else {
	          	if (item) {
		        	var errStr = item;
		        	return res.send(409,errStr);	
		        }
	          	return res.send(404, 'NOT FOUND');
			}
		});
	}

}


//delete account
exports.deleteVendor = function (){
	return function (req, res) {
		log.line ("deleteVendor");
		var entityID = req.params[0];
		
		vendorManager.removeItem( entityID, function (err, item){
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
function prepareVendorsResults(itemsA){
    var resultingArray = new Array();
    itemsA.forEach(function (item){
    	//log.info('before');
      	resultingArray[resultingArray.length] = prepareVendorResult(utils.prepareDBResultEntity(item));
      	//log.info('after');
    });
    return resultingArray;
}

//prepare the result, which we will show to the end user
function prepareVendorResult(item){
    var publicItem = new Object();
    if (item){
	   	publicItem	= utils.mergeRecursiveDBResult(publicItem,item, [], 2);
    }
    log.line(publicItem);
    return publicItem;
}

