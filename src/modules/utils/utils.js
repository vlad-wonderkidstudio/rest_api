/*
* Recursively merge properties of two objects 
*/
exports.mergeRecursive = function (obj1, obj2, limit) {

  //log.line (typeof limit);
  if (typeof (limit) == 'undefined') {limit = 10;} //default limit is 10
  //log.line (limit);
  if (!limit) return;
  
  limit--;
  //log.line ('after minus=' + limit);

  if (!obj1) {obj1 = {};}

  for (var p in obj2) {
    try {
      //log.line(obj2[p]);

      //if ( obj2[p] instanceof Function  ) { continue; }

      // Property in destination object set; update its value.
      if ( (obj2[p].constructor==Object) ) {
        obj1[p] = this.mergeRecursive(obj1[p], obj2[p], limit);

      } else {
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];

    }
  }

  return obj1;
}


exports.mergeRecursiveDBResult = function (obj1, obj2, hideFieldsA, limit) {

  //log.line('limita='+limit);
  if (typeof limit == 'undefined'){limit = 10;} //default limit is 10
  if (!limit) return;
  limit--;
  //log.line('limitb='+limit);

  if (!obj1) {obj1 = {};}

  for (var p in obj2) {
    
    //log.info('p='+p);
    if ('$__' == p ) { continue; }
    if ('__v' == p ) { continue; }
    if ('_id' == p ) { continue; }
    //hide the item, if it is inside the hideFieldsA
    if ( (hideFieldsA) && ( hideFieldsA.indexOf(p) >=0 ) )
    {
      obj1[p]= null; continue; 
    }
    //if ('Password' == p ) { obj1[p]= null; continue; }
    //log.info('p='+p);
    try {

      if ( obj2[p] instanceof Function  ) { continue; }

      // Property in destination object set; update its value.
      //if ( (obj2[p].constructor==Object)|| (typeof obj2[p] == 'object') ) 
      if ( (obj2[p].constructor==Object) ) 
      {
        obj1[p] = this.mergeRecursiveDBResult(obj1[p], obj2[p], hideFieldsA, limit);

      } else {
        //log.line(typeof obj2[p]);
        obj1[p] = obj2[p];

      }

    } catch(e) {
      // Property in destination object not set; create it and set its value.
      //obj1[p] = obj2[p];

    }
  }

  return obj1;
}

exports.salt = "KS24lhsafdj98em498jfad";

/*
* Create sault
*/
exports.createUniqueString = function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
};

/*
* Prepare the DB result object for mergint etc...
*/
exports.prepareDBResultEntity = function (entity){
  if (!entity) {return entity;}
  var resObjStr = JSON.stringify(entity);
  return JSON.parse(resObjStr);
}