var unitOfMeasureManager = require ('./unit-of-measure-manager-abstract.js').init();

//get all items
exports.getAllUnitsOfMeasure = function (){
	return function (req, res) {
		log.line ("getAllUnitsOfMeasure");
		unitOfMeasureManager.getAllItems(function (err, itemsA){
			if (err){
				log.error(err);
				return res.send(500); //some unexpected error
			}else{
				return res.send(200, prepareUnitsOfMeasureResults(itemsA)); //return the list
			}
		});
	}
}


//get single item
exports.getUnitOfMeasure = function (){
	return function (req, res) {
		log.line ("getUnitOfMeasure");
		var entityID = req.params[0];
		log.line ('entityID='+entityID);
		unitOfMeasureManager.getItem( entityID, function (err, item){
			if ((!err)&&(item)) {
		        res.set({
		                  'X-My-Header': 'The Value',
		                });
		        return res.send(200, prepareUnitOfMeasureResult(item)); //found and return it now
		    } else {
		        log.error(err);
		        return res.send(404, 'NOT FOUND');
		    }
		});
	}
}

//create account
exports.createUnitOfMeasure = function (){
	return function (req, res) {
		log.line ("createUnitOfMeasure"+req.body);
		
		var obj = req.body;

		unitOfMeasureManager.createNewItem( obj, function (err, item){
			if (!err) {
		        log.line("unitOfMeasure created1");
		        log.line(item);
		        log.line("unitOfMeasure created2");
		        return res.send(201,prepareUnitOfMeasureResult(item)); //created
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
exports.updateUnitOfMeasure = function (){
	return function (req, res) {
		log.line ("updateUnitOfMeasure");
		
		var obj = req.body;
		unitOfMeasureManager.updateItem( obj, function (err, item){
			if (!err) {
	          log.line("updated");
	          log.line(item);
	          return res.send(200, prepareUnitOfMeasureResult(item)); //updated sucessfully
	        } else {
	          log.error(err);
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
exports.deleteUnitOfMeasure = function (){
	return function (req, res) {
		log.line ("deleteUnitOfMeasure");
		var entityID = req.params[0];
		
		unitOfMeasureManager.removeItem( entityID, function (err, item){
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
function prepareUnitsOfMeasureResults(itemsA){
    var resultingArray = new Array();
    itemsA.forEach(function (item){
    	//log.info('before');
      	resultingArray[resultingArray.length] = prepareUnitOfMeasureResult(utils.prepareDBResultEntity(item));
      	//log.info('after');
    });
    return resultingArray;
}

//prepare the result, which we will show to the end user
function prepareUnitOfMeasureResult(item){
    var publicItem = new Object();
    if (item){
	   	publicItem	= utils.mergeRecursiveDBResult(publicItem,item, [], 2);
    }
    log.line(publicItem);
    return publicItem;
}

