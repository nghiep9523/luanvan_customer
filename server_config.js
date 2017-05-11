var sql = require('mssql');
//2.
function ServerConfig() {
	this.config = {
	    server: '79b3b01c-441b-4737-bd3a-a76e004f1ef6.sqlserver.sequelizer.com',
	    database: 'db79b3b01c441b4737bd3aa76e004f1ef6',
	    user: 'sncwvkluwaeksmom',
	    password: 'SgCygGCadzZjv6vgUrhL7KrFMAAch7TV6hV7bEhmdeXyFrA5NeMyv5FhX5TNfz2f',
	    port: 1433
	};
	this.amqpURL = 'amqp://imtqjgzz:LQWyhmVxKBMgV6ROObew36G07DUs6ZYZ@white-mynah-bird.rmq.cloudamqp.com/imtqjgzz';
}

module.exports = new ServerConfig();