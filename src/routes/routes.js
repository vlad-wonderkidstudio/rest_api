var routes = {};

routes.root = require(config.modulesDir + '/root/root.js');
routes.loginModule = require(config.modulesDir + '/login/login.js');
routes.userAccount = require(config.modulesDir + '/user_account/user-account-manager.js');
routes.vendor = require(config.modulesDir + '/vendor/vendor-manager.js');
routes.category = require(config.modulesDir + '/category/category-manager.js');
routes.uom = require(config.modulesDir + '/unit_of_measure/unit-of-measure-manager.js');
routes.unittest = require(config.modulesDir + '/unit_test/unit-test.js');


//routing scheme
module.exports = function(app, express, models) {
  
  app.get('/', routes.root.getIndex());

  //static
  app.use(express.static(config.publicFolder));

  //unittest
  app.get('/unittest', routes.unittest.getIndex());
  app.get('/unittest/cleardb', routes.unittest.clearDB());
  app.get('/unittest/clearredis', routes.unittest.clearRedis());
  app.get('/unittest/cleardbandredis', routes.unittest.clearDBandRedis());

  //login
  app.post('/login', routes.loginModule.login());
  app.post('/loginfail', routes.loginModule.loginFail());

  //useraccout
  app.get('/useraccount', passport.authenticate('basic', { session: false }), routes.userAccount.getAllUserAccounts());
  app.post('/useraccount', passport.authenticate('basic', { session: false }), routes.userAccount.createUserAccount());
  app.put('/useraccount', passport.authenticate('basic', { session: false }), routes.userAccount.updateUserAccount());
  app.get(/^\/useraccount\/(.+)?$/, passport.authenticate('basic', { session: false }), routes.userAccount.getUserAccount());
  app.delete(/^\/useraccount\/(.+)?$/, passport.authenticate('basic', { session: false }), routes.userAccount.deleteUserAccount());

  //vendor
  app.get('/vendor', passport.authenticate('basic', { session: false }), routes.vendor.getAllVendors());
  app.post('/vendor', passport.authenticate('basic', { session: false }), routes.vendor.createVendor());
  app.put('/vendor', passport.authenticate('basic', { session: false }), routes.vendor.updateVendor());
  app.get(/^\/vendor\/(.+)?$/, passport.authenticate('basic', { session: false }), routes.vendor.getVendor());
  app.delete(/^\/vendor\/(.+)?$/, passport.authenticate('basic', { session: false }), routes.vendor.deleteVendor());

  //category
  app.get('/category', passport.authenticate('basic', { session: false }), routes.category.getAllCategories());
  app.post('/category', passport.authenticate('basic', { session: false }), routes.category.createCategory());
  app.put('/category', passport.authenticate('basic', { session: false }), routes.category.updateCategory());
  app.get(/^\/category\/(.+)?$/, passport.authenticate('basic', { session: false }), routes.category.getCategory());
  app.delete(/^\/category\/(.+)?$/, passport.authenticate('basic', { session: false }), routes.category.deleteCategory());

  //units of measure
  app.get('/uom', passport.authenticate('basic', { session: false }), routes.uom.getAllUnitsOfMeasure());
  app.post('/uom', passport.authenticate('basic', { session: false }), routes.uom.createUnitOfMeasure());
  app.put('/uom', passport.authenticate('basic', { session: false }), routes.uom.updateUnitOfMeasure());
  app.get(/^\/uom\/(.+)?$/, passport.authenticate('basic', { session: false }), routes.uom.getUnitOfMeasure());
  app.delete(/^\/uom\/(.+)?$/, passport.authenticate('basic', { session: false }), routes.uom.deleteUnitOfMeasure());


};