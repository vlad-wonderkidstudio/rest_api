var DataStorageSchema = require(config.modelsFolder+'/DataStorage/DataStorageSchema.js')().DataStorageSchema;

//model for Mongo DB
module.exports = function(mongoose) {
  var UserAccount, ObjectId, Schema;
  
//   Schema = mongoose.Schema;  
//log.info (Schema);

  UserAccount = new DataStorageSchema({
    Email: String,
    EmailHash: String,
    Phone: String,
    FirstName: String,
    LastName: String,
    //Password: String,
    HashedPassword: String,
    IsAdministrator: Boolean,
    LinkedIn: String,
    FullName: String,
    DisplayName: String,
    ChangedBy: String,

  });

  //log.line (UserAccount);
  
  this.model = mongoose.model('UserAccount', UserAccount);
  return this;
};
