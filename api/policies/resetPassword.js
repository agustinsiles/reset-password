module.exports = (req, res, next) => {
	let token;

	if (req.headers && req.headers.authorization) {
		const parts = req.headers.authorization.split(' ');
		
		if (parts.length === 2) {
			const [ scheme, credentials ] = parts;
			if (/^Bearer$/i.test(scheme)) token = credentials;
		} else {
			return res.status(401).json({ err: 'Invalid credentials' });
		}
	} else if (req.param('token')) {
		token = req.param('token');
		delete req.query.token;
	} else {
		return res.status(400).json({ err: 'Invalid credentials' });
	}

	jwtAuth.verifyResetPwdAccessToken(token, (err, token) => {
		if (err) {
			token = null;
			return res.status(403).json({ err: 'Invalid credentials' });
		} 
			
		req.token = token;
		next();
	});
};
