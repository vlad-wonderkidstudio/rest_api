var DataStorageSchema = require(config.modelsFolder+'/DataStorage/DataStorageSchema.js')().DataStorageSchema;

//model for Mongo DB
module.exports = function(mongoose) {
  var Category, ObjectId, Schema;
  
  Category = new DataStorageSchema({
    Name: String, //   unique: true,
    ChangedBy: String,
  });
  
  this.model = mongoose.model('Category', Category);
  return this;
};
