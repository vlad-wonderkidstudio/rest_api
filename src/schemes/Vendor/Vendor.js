var DataStorageSchema = require(config.modelsFolder+'/DataStorage/DataStorageSchema.js')().DataStorageSchema;

//model for Mongo DB
module.exports = function(mongoose) {
  var Vendor, ObjectId, Schema;
  
  Vendor = new DataStorageSchema({
    ClientID: String,
    Name: String,
    NameAdditional: String,
    ContactName: String,
    Address1: String,
    Address2: String,
    City: String,
    State: String,
    PostalCode: String,
    Phone: String,
    Fax: String,
    Email: String,
    PreferredContactMethod: String,
    MinimumOrder: Number,
    Notes: String,
    ChangedBy: String,
  });
  
  this.model = mongoose.model('Vendor', Vendor);
  return this;
};
