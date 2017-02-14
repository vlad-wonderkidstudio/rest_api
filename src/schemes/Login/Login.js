var DataStorageSchema = require(config.modelsFolder+'/DataStorage/DataStorageSchema.js')().DataStorageSchema;

//model for Mongo DB
module.exports = function(mongoose) {
  var Login, ObjectId, Schema;
  
//   Schema = mongoose.Schema;  
//log.info (Schema);

  Login = new DataStorageSchema({
    AuthToken: String,
    UserEntityID: String,
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
    ChangedByID: String,

  });

  this.model = mongoose.model('Login', Login);
  return this;
};