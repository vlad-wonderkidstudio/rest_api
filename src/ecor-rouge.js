exports.start  = function() {
    
    //Include the config file
    var rootDir = __dirname;
    var config = require('./config/config.js')(rootDir);
    
    //use express framework
    var express       = require('express');
    var app           = express();
    module.exports = app;

    //ECT template system
    var ECT           = require('ect');

    //util
    var util = require('util');

    //redis
    var redis = require("redis");
    var redisClient = redis.createClient();

    
    //adding log
    var log     = require('logule').init(module); //suitable logger
    app.log       = log; //adding log
    

    //Connect middleware
    var bodyParser = require('body-parser');
    
    
    //Http Auth (actually even a bit more complex system, but it can be used for our need as well)
    var passport  = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;
    

    //UUID
    var uuid = require('node-uuid');

    //my utils
    var utils = require(config.modulesDir + '/utils/utils.js');

    //MongoDB
    app.mongoose  = require ('mongoose'); //ODM for MongoDb
    //We will place all the models here
    var models        = {};


    //Globals [START]
   
    global.rootDir = rootDir;
    global.config = config;
    global.util = util;
    global.log    = log;
    global.redisClient = redisClient;
    global.redis = redis;
    global.uuid = uuid;
    global.mongoose = app.mongoose;
    global.models = models;
    global.utils = utils;
    global.passport = passport;
    global.currentLoggedInUser =null;
    //Globals [END]
    
    
 
 
    //Configure modules, etc
    var configurerParams = {
        express: express,
        app: app,
        ECT: ECT,
        models: models,
        bodyParser: bodyParser,
        BasicStrategy: BasicStrategy,
    };
    var configurer    = require('./configurer.js')(configurerParams); // configure modules 

    //Routing file (for the file structure of the project)
    require(config.routesFolder+'/routes.js')(app, express, models);


    app.listen (config.processPort);

    log.info (config.processPort);
}