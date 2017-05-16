var sql = require('mssql');
var bcrypt = require('bcrypt');
var server = require('../server_config');

const saltRounds = 10;

function User() {
	this.login = function(payload, res) {
		sql.connect(server.config, function (err) {
			const request = new sql.Request();
			var username = payload.username;
			var inputPassword = payload.password;
			var storedPassword = null;
			var data = null;

			request.input('username', sql.NVarChar, username);

			request.execute('uspLoginPassenger', (err, recordsets, returnValue, affected) => {
				if (!err) {
				    if (!recordsets[0][0]) {
				    	res.status(400).send({status: 400, message:"Username doesn't exist!!"});
				    } else {
				    	storedPassword = recordsets[0][0].password;
				    	data = recordsets[0][0];
				    	delete data['password'];
				    	if (bcrypt.compareSync(inputPassword, storedPassword)) {
				    		res.status(200).send({status: 200, payload: data});
				    	} else {
				    		res.status(400).send({status: 400, message: "Wrong Password!!"});
				    	}
				    }
				} else {
					res.status(400).send({status: 400, message: "Something happened, please try again"});
				}
			});
		});
	}

	this.register = function(payload, res) {
		sql.connect(server.config, function (err) {
			var request = new sql.Request();
			var username = payload.username;
			var password = payload.password;
			var email = payload.email;
			var fullname = payload.fullname;
			var phone = payload.phone;
			var currentDate = new Date();
			var salt = bcrypt.genSaltSync(saltRounds);
			var userID = bcrypt.hashSync(username, salt);
			var password = bcrypt.hashSync(password, salt);

			request.input('userID', sql.NVarChar, userID);
			request.input('username', sql.NVarChar, username);
			request.input('password', sql.NVarChar, password);
			request.input('email', sql.NVarChar, email);
			request.input('userFullname', sql.NVarChar, fullname);
			request.input('phone', sql.NVarChar, phone);
			request.input('createdDate', sql.DateTime, currentDate);

			request.execute('uspRegisterPassenger', (err, result) => {
			    if(!err) {
			    	res.status(200).send({status: 200});
			    } else {
			    	if (err.number == 2627) {
			    		res.status(400).send({status: 400, message: "Username already exist"});
			    	} else {
			    		res.status(400).send({status: 400, message: "Something happened, please try again"});
			    	}
			    }
			});
		});
	}

	this.getUserInfo = function(payload, res) {
		sql.connect(server.config, function (err) {
			const request = new sql.Request();

			request.input('userID', sql.NVarChar, payload.userID);

			request.execute('uspGetUserInfo', (err, recordsets, returnValue, affected) => {
				if (!err) {
					var data = recordsets[0][0];
					delete data['password'];
					res.status(200).send({status: 200, payload: data});
				} else {
					res.status(400).send({status: 400, message: "Something happened, please try again"});
				}
			});
		});
	}
}

module.exports = new User();