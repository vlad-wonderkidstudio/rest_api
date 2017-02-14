var DataStorageSchema = require(config.modelsFolder+'/DataStorage/DataStorageSchema.js')().DataStorageSchema;

//model for Mongo DB
module.exports = function(mongoose) {
  var UnitOfMeasure, ObjectId, Schema;
  
  UnitOfMeasure = new DataStorageSchema({
    Name: String, //unique
    Abbreviation: String, //unique
    TypeID: String,
    BaseConversionFactor: String,
    CanBeUsedForInventory: String,
    CanBeUsedForOrdering: String,
    IsNatural: String,
    ChangedBy: String,
  });
  
  this.model = mongoose.model('UnitOfMeasure', UnitOfMeasure);
  return this;
};
