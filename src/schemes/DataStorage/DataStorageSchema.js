//This is a parent Data Storage scheme model for Mongo DB
//You should not use it dirrectly, but create children-schemas off it instead
module.exports = function() {
  var NotesSchema, ObjectId, Schema;
  Schema = mongoose.Schema;

  //Prototype for the DataStorage Scheme
  function DataStorageSchema(obj, options){
  	if (!obj) {obj = {}; }
  	
  	var mandatoryOptions = {
	  	_id: { type: String, index: { unique: true }},
	  	EntityID: String, //UUID
  		Version: { type: String, index: {unique: true}}, //UUID
  		PreviousVersion: String, //UUID
  		Active: Boolean,
  		Latest: Boolean,
  		ChangedByID: String, //UUID
  		ChangedOn: { type: Date, default: Date.now },
	   };

    //log.line(obj);
  	var obj1 = utils.mergeRecursive(mandatoryOptions, obj);
    //log.line(obj1);

  	if (!options) {options = {}; }
  	options._id = false;

  	DataStorageSchema.super_.call(this, obj1, options);

  }

  //inheritance
  util.inherits(DataStorageSchema, Schema);

/*
  //create a new _id of the type UUID when saving
  DataStorageSchema.prototype.pre = function(method, fn){
  	if (method == 'save' ){
  		if(!this.isNew) {} //do notthing
  		else{
  			this._id = uuid.v1();	
  			//this.EntityID = this._id;
  		}	
    }
  	Schema.super_.pre.apply(this, arguments);
  };
*/

  //It is for prototypes only
  this.model = function () {
  	var dataStorageSchema = new DataStorageSchema();
  	return mongoose.model('DataStorageSchema', dataStorageSchema);
  }

  this.DataStorageSchema = DataStorageSchema;
  return this;
  
};
