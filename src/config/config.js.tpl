module.exports = function(rootDir) {
    
    var config = this;
    
    /*
        Important - this is development/production switch (can also be set from command line before running app, like NODE_ENV=production node app.js)
    */
    process.env.NODE_ENV = "<!-- @echo env -->";

    this.mongodbUrl = "<!-- @echo mongodb_url -->";
    this.mongodbUrlOptions  =  {
        user: "<!-- @echo mongodb_user -->",
        pass: "<!-- @echo mongodb_pass -->"
    };

    this.publicFolder   = rootDir + '/public';
    this.cssFolder      = this.publicFolder + '/css';
    this.imgFolder      = this.publicFolder + '/img';
    this.jsFolder       = this.publicFolder + '/js';

    this.modelsFolder   = rootDir + '/schemes';
    this.routesFolder   = rootDir + '/routes';

    this.modulesDir      = rootDir + '/modules';
    this.templatesFolder = rootDir + '/modules';
    this.reposDir        = rootDir + '/repositories';

    this.processPort    = process.env.PORT || 3000; // (can also be set from command line before running app, like PORT=production node app.js)

    this.redisPrefix    = 'ecorR:';


    return (this);

}