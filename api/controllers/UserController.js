/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {
	login: (req, res) => {
		const { EMAIL, PASSWORD } = req.body;
            
		if (!EMAIL || !PASSWORD) {
			return res.status(400).json({ err: 'Credentials are required.' });
		}

		User.findOne({ EMAIL, ACTIVE: true })
			.then(user => {
				if (!user)  {
					return res.status(401).json({ err: 'Invalid credentials.' });
				}
		
				User.validatePassword(PASSWORD, user, (err, valid) => {
					if (err || !valid) {
						return res.status(401).json({ err: 'Invalid credentials' });
					}
					
					const token = jwtAuth.issuePublicAccessToken({ user });

					return res.status(200).json({ user, token });
				});
			}).catch(err => res.status(500).json({ err }));
	},
	signup: (req, res) => {
		const { EMAIL, PASSWORD } = req.body;

		if (!PASSWORD || !EMAIL) {
			return res.status(400).json({ err: 'Credentials are required.' });
		}

		User.findOne({ EMAIL, ACTIVE: false })
			.then(user => {
				if (!user) {
					return res.status(401).json({ err: 'Invalid credentials.' });
				}

				User.update({ EMAIL }, { PASSWORD, ACTIVE: true })
					.then(() => res.status(200).json({ 
						user,
						token: jwtAuth.issuePublicAccessToken({ user })
					}))
					.catch(err => res.status(500).json({ err }));
			}).catch(err => res.status(500).json({ err }));
	},
	requestPasswordReset: (req, res) => {
		const { EMAIL } = req.body;

		if (!EMAIL) {
			return res.status(400).json({ err: 'Credentials are required.' });
		}
		
		User.findOne({ EMAIL, ACTIVE: true })
			.then(user => {
				if (!user) {
					return res.status(401).json({ err: 'Invalid credentials.' });
				}

				const token = jwtAuth.issueResetPwdAccessToken({ user });

				sails.hooks.email.send('passwordReset', { token }, {
					to: EMAIL,
					subject: "Forgot your password?"
				}, err => {
					if (err) return res.status(500).json(err);
					return res.status(200).json({});
				});
		});
	},
	resetPassword: (req, res) => {
		const PASSWORD = req.body.pwd,
			EMAIL = req.token.user.EMAIL;

			User.findOne({ EMAIL })
				.then(user => {
					if (!user) {
						return res.status(401).json({ err: 'Invalid credentials.' });
					}

					User.update({ EMAIL }, { PASSWORD })
						.then(() => res.status(200).json({ msg: 'Password updated successfully!' }))
						.catch(err => res.status(500).json({ err }));
				}).catch(err => res.status(500).json({ err }));
	},
	_config: { actions: false, shortcuts: false, rest: false }
};
