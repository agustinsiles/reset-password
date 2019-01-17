const path = require('path'),
    sails = require('sails');

module.exports.email = {
    transporter: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: 'yourgmailaccount@gmail.com',
            pass: 'yourpassword'
        }
    },
    templateDir: path.resolve(sails.config.appPath, 'views/emailTemplates'),
    from: 'noreply@agustinsiles10.com',
    testMode: false
};
