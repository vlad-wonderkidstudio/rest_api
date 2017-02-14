 function(mongoose) {
  var NotesSchema, ObjectId, Schema;
  Schema = mongoose.Schema;

  //Prototype for the DataStorage Scheme
  function DataStorage(obj, options){
  	if (!obj) {obj = {}; }
  	
  	obj._id = { type: String, index: { unique: true } };
  	obj.EntityID = String; //UUID
  	obj.Version = String; //UUID
  	obj.PreviousVersion = String; //UUID
  	obj.Active = Boolean;
  	obj.Latest = Boolean;
  	obj.ChangedByID = String; //UUID
    obj.ChangedBy= String; //DisplayName
  	obj.ChangedOn = { type: Date, default: Date.now };

  	if (!options) {options = {}; }
  	options._id = false;
   
  	Schema.super_.call(this, obj, options);

  }

  //inheritance
  util.inherits(DataStorage, Schema);

  //create a new _id of the type UUID when saving
  DataStorageSchema.prototype.pre = function(method, fn){
  	if (method == 'save' ){
  		if(!this.isNew) {} //do notthing
  		else{
  			this._id = uuid.v1();	
  			this.EntityID = this._id;
  		}	
    }
  	Schema.super_.pre.apply(this, arguments);
  };

  this.DataStorageSchema = DataStorageSchema;
  return this;
  
};


exports.DataStorage = DataStorage; //Class defenition