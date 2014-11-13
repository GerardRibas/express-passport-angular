var url = require('url');
var jwt = require('jwt-simple');
var User = require('./models/user');
var config = require('../config/config.js');
module.exports = function(req,res,next){
	var parsed_url = url.parse(req.url, true);

	var token = (req.body && req.body.access_token) || parsed_url.query.access_token || req.headers["x-access-token"];
	if(token) {
			var decoded = jwt.decode(token, config.secret);
			if (decoded.exp <= Date.now()) {
				res.status(400).json({ "error": { "message": "Token has expired", "type": "OAuthException" }});
			} else {
				User.findOne({'_id' : decoded.iss }, function(err,user) {
					if(err)
						return next(err);
					req.user = user;
					return next();
				});	
			}
	} else {
		res.status(400).end();
	}

};