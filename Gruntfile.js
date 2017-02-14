var config = {
	dev: {
		name: "development",
		mongodb: {
			dbname: "tmpmedia",
			server: "localhost",
			port: "",
			url: "mongodb://localhost/tmpmedia",
			user: "tmpmedia",
			pass: "123456"
		}
	},

	prod: {
		name: "production",
		mongodb: {
			dbname: "tmpmedia",
			server: "localhost",
			port: "",
			url: "mongodb://localhost/tmpmedia",
			user: "admin",
			pass: "123456"
		}
	},

	defaultCollections: {
		collections: [
			"datastorageschemas",
			"logins",
			"useraccounts",
			"vendors",
			"unitofmeasure",
		],
	},
	defaultUser:  {
		   _id: "b96f5cf0-e839-11e3-bd7b-f734056bb208",
		   Email: "system@inventoryoptix.com",
		   FirstName: "System",
		   LastName: "Account",
		   IsAdministrator: true,
		   EntityID: "b96f5cf0-e839-11e3-bd7b-f734056bb208",
		   Version: "b96f5cf1-e839-11e3-bd7b-f734056bb208",
		   PreviousVersion: "00000000-0000-0000-0000-000000000000",
		   Active: true,
		   Latest: true,
		   ChangedByID: "00000000-0000-0000-0000-000000000000",
		   EmailHash: "084e1580b975ba96385d46fdb168f470",
		   HashedPassword: "27bc2b305a5dae25d413cfb5dff52f75",
		   FullName: "System Account",
		   DisplayName: "System Account",
		   ChangedBy: "System Account",		   
		   ChangedOn: "2014-05-30T20:33:57.367Z",
		   
	}	

};

function getConfig(curEnv) {
	return {
		preprocess: {
			backend: {
				src:  "src/config/config.js.tpl",
				dest: "src/config/config.js",
				options: {
					context: {
						env: config[curEnv].name,
						mongodb_url: config[curEnv].mongodb.url,
						mongodb_user: config[curEnv].mongodb.user,
						mongodb_pass: config[curEnv].mongodb.pass
					}
				}
			}
		},

		
	}
}

module.exports = function(grunt) {
	//grunt.loadNpmTasks("grunt-contrib-copy");
	//grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-preprocess");

	grunt.registerTask("npmInstall", "Do NPM install", function(curEnv) {
		var exec = require('child_process').exec;
		var cb = this.async();
		exec('npm install', {cwd: 'src'}, function(err, stdout, stderr) {
			console.log("npmInstall"+stdout+'\n##\n'+stderr);
			cb();
		});
	});

	grunt.registerTask("setDB", "Create DB and Empty collections", function(curEnv) {
		var exec = require('child_process').exec;
		var cb = this.async();
		var paramsObj = config.defaultCollections;
		
		var collectionsStr ="";
		paramsObj.collections.forEach(function(element){
			collectionsStr += "db.createCollection('"+element+"'); " ;
		});

		var dbcode = "{"+
			"var db = db.getSiblingDB('"+config[curEnv].mongodb.dbname+"'); "+
			"db."+config[curEnv].mongodb.dbname+".find(); "+
			collectionsStr+
			"db.getCollection('useraccounts').update("+
					"{ _id: \""+config.defaultUser._id+"\"},"+
					JSON.stringify(config.defaultUser)+","+
					"{ upsert: true }"+
			");"+
		"}";	
		dbcode = dbcode.replace(/"/g,'\\\"');
		
		//console.log(config);
		var commandParameters = " " + config[curEnv].mongodb.server +
								((config[curEnv].mongodb.port)?(":" + config[curEnv].mongodb.port):"") +
								" --eval \"" + dbcode + "\"";

		var commandStr = 'mongo '+commandParameters;
		console.log("DB command="+commandStr);		

		exec(commandStr, function(err, stdout, stderr) {
			console.log("setDB"+stdout+'\n##\n'+stderr);
			cb();
		});
	});

	grunt.registerTask("build", "Build with certain environment", function(type) {
		if(["dev", "prod"].indexOf(type) == -1) {
			type = "dev";
		}

		grunt.log.writeln("Starting to build app in " + type + " environment");

		//console.log('before initConfig');
		grunt.initConfig(getConfig(type));
		//console.log('after initConfig');

		grunt.task.run([
			"preprocess:backend",
			"setDB:" + type,
			"npmInstall:" + type,
		]);
	});
};