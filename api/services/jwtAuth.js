const jwt = require('jsonwebtoken'),
    jwtPublicAccess = {
        expiresIn: (60 * 60) * 12,
        secret: "mytopsecret",
        algorithm : "HS256",
        issuer : "sevajs",
        audience : "public"
    };

module.exports.issuePublicAccessToken = payload => {
    return jwt.sign(payload, jwtPublicAccess.secret, {
        algorithm: jwtPublicAccess.algorithm,
        expiresIn: jwtPublicAccess.expiresIn,
        issuer: jwtPublicAccess.issuer,
        audience: jwtPublicAccess.audience
    });
};

// This will be used when user attempts to access restricted areas
module.exports.verifyPublicAccessToken = (token, verified) => {
    return jwt.verify(token, jwtPublicAccess.secret, {
        algorithm: jwtPublicAccess.algorithm,
        ignoreExpiration: false,
        issuer: jwtPublicAccess.issuer,
        audience: jwtPublicAccess.audience
    }, verified);
};

module.exports.issueResetPwdAccessToken = payload => {
    return jwt.sign(payload, jwtPublicAccess.secret, {
        algorithm: jwtPublicAccess.algorithm,
        expiresIn: 60 * 60,
        issuer: jwtPublicAccess.issuer,
        audience: jwtPublicAccess.audience
    });
};

module.exports.verifyResetPwdAccessToken = (token, verified) => {
    return jwt.verify(token, jwtPublicAccess.secret, {
        algorithm: jwtPublicAccess.algorithm,
        ignoreExpiration: false,
        issuer: jwtPublicAccess.issuer,
        audience: jwtPublicAccess.audience
    }, verified);
};