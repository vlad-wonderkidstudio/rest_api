var categoryManager = require ('./category-manager-abstract.js').init();

//get all items
exports.getAllCategories = function (){
	return function (req, res) {
		log.line ("getAllCategories");
		categoryManager.getAllItems(function (err, itemsA){
			if (err){
				log.error(err);
				return res.send(500); //some unexpected error
			}else{
				return res.send(200, prepareCategoriesResults(itemsA)); //return the list
			}
		});
	}
}


//get single item
exports.getCategory = function (){
	return function (req, res) {
		log.line ("getCategory");
		var entityID = req.params[0];
		log.line ('entityID='+entityID);
		categoryManager.getItem( entityID, function (err, item){
			if ((!err)&&(item)) {
		        res.set({
		                  'X-My-Header': 'The Value',
		                });
		        return res.send(200, prepareCategoryResult(item)); //found and return it now
		    } else {
		        log.error(err);
		        return res.send(404, 'NOT FOUND');
		    }
		});
	}
}

//create account
exports.createCategory = function (){
	return function (req, res) {
		log.line ("createCategory"+req.body);
		
		var obj = req.body;

		categoryManager.createNewItem( obj, function (err, item){
			if (!err) {
		        log.line("category created1");
		        log.line(item);
		        log.line("category created2");
		        return res.send(201,prepareCategoryResult(item)); //created
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
exports.updateCategory = function (){
	return function (req, res) {
		log.line ("updateCategory");
		
		var obj = req.body;
		categoryManager.updateItem( obj, function (err, item){
			if (!err) {
	          log.line("updated");
	          log.line(item);
	          return res.send(200, prepareCategoryResult(item)); //updated sucessfully
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
exports.deleteCategory = function (){
	return function (req, res) {
		log.line ("deleteCategory");
		var entityID = req.params[0];
		
		categoryManager.removeItem( entityID, function (err, item){
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
function prepareCategoriesResults(itemsA){
    var resultingArray = new Array();
    itemsA.forEach(function (item){
    	//log.info('before');
      	resultingArray[resultingArray.length] = prepareCategoryResult(utils.prepareDBResultEntity(item));
      	//log.info('after');
    });
    return resultingArray;
}

//prepare the result, which we will show to the end user
function prepareCategoryResult(item){
    var publicItem = new Object();
    if (item){
	   	publicItem	= utils.mergeRecursiveDBResult(publicItem,item, [], 2);
    }
    log.line(publicItem);
    return publicItem;
}

