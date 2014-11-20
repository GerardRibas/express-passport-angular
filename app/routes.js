module.exports = function(app, passport, jwt, moment, config, jwtauth) {

    app.get('/oauth', function(req, res){
        res.sendfile('./public/app/index.html');
    });

	app.post('/oauth/api/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
        	if (err)
        		return next(err)

        	if (user) {
                var expires = moment().add(30, 'minutes').valueOf();
                var token = jwt.encode({
                    iss: user._id,
                    exp: expires
                    }, config.secret);
 
                res.json({
                    token : token,
                    expires: expires,
                    user_id: user._id
                });
        	} else {
                res.json(401, info);
        	}
    	})(req, res, next);
	});

	app.post('/oauth/api/signup', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
        	if (err)
        		return next(err)

        	if (!user) {
            	res.json(401, info);
        	} else {
                var expires = moment().add(30, 'minutes').valueOf();
                var token = jwt.encode({
                    iss: user._id,
                    exp: expires
                    }, config.secret);
                
                res.json({
                    token : token,
                    expires: expires,
                    user_id: user._id
                });
        	}
    	})(req, res, next);
	});

    app.get('/oauth/api/profile', [jwtauth], function(req, res) {
        res.json(req.user);
    });
    
};