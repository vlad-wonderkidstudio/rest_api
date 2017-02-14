module.exports = function(rootObj) {
  
  var app, configurer, connectDomain, express, models;
  var configurer = this;
  var app = rootObj.app;
  var ECT = rootObj.ECT;
  var express = rootObj.express;
  var connectDomain = rootObj.connectDomain;
  var models = rootObj.models;
  var bodyParser = rootObj.bodyParser;
  var BasicStrategy = rootObj.BasicStrategy;

  log.info(config.mongodbUrl);
  
  //Middleware
  app.use(bodyParser());
  
  //ECT template system
  var ectRenderer = ECT({ watch: true, root: config.templatesFolder, ext : '.ect' });

  app.set('view engine', 'ect');
  app.engine('ect', ectRenderer.render);
  app.set('views', config.templatesFolder);

  //Errors handling
  app.use(function(err, req, res, next) {
    log.error(err.stack);

    res.send(500, 'Something broke!');
  });
  
  log.info (app.get('env'));

  if ('development' == app.get('env')) {
    //app.mongoose.connect(config.dev_mongoDdUrl, config.dev_mongoDdUrlOptions);
  };
  
  if ('production' == app.get('env')) {
    //app.mongoose.connect(config.prod_mongoDdUrl, config.prod_mongoDdUrlOptions);
  };
  app.mongoose.connect(config.mongodbUrl, config.mongodbUrlOptions);

 
  //Loading DB schemas/modules [start]
  //models.DataStorageSchema = require(config.modelsFolder + '/DataStorage/DataStorageSchema.js')(app.mongoose).model();
  models.UserAccount = require(config.modelsFolder + '/UserAccount/UserAccount.js')(app.mongoose).model;
  models.Vendor = require(config.modelsFolder + '/Vendor/Vendor.js')(app.mongoose).model;
  models.Category = require(config.modelsFolder + '/Category/Category.js')(app.mongoose).model;
  models.UnitOfMeasure = require(config.modelsFolder + '/UnitOfMeasure/UnitOfMeasure.js')(app.mongoose).model;
  models.Login = require(config.modelsFolder + '/Login/Login.js')(app.mongoose).model;
  //Loading DB schemas/modules [end]

  //Set mandatory headers
  app.use(function(req, res, next) {
    //log.line (req.url);
    res.setHeader('Access-Control-Allow-Headers','Origin,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,POST,PUT,DELETE,TRACE,CONNECT');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Max-Age', '10');
    //check - if a unittest file, then do not set Content-type
    var myRe = /\/unittest/i;
    if ( (resA = myRe.exec(req.url)) == null){
      //not unittest - send default Content-Type
      res.setHeader('Content-Type', 'application/json');
    }
    return next();
  });

  //HTTP AUTH [start]
  app.use(passport.initialize());
  var login = require(config.modulesDir + '/login/login.js');
  
  //   Use the BasicStrategy within Passport.
  //   Strategies in Passport require a `verify` function, which accept
  //   credentials (in this case, a username and password), and invoke a callback
  //   with a user object.
  passport.use(new BasicStrategy({},login.loginVerification ));
  //HTTP AUTH [end]


  return configurer;
};