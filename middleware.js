var cryptojs = require('crypto-js');

module.exports = function (db) {
    return {
        requireAuthentication: function (req, res, next) {
            var token = req.get('Auth') || '';

            db.token
                .findOne({
                    where: {
                        tokenHash: cryptojs.MD5(token).toString()
                    }
                })
                .then(function (token_instance) {
                    if (!token_instance) {
                        throw new Error();
                    }

                    req.token = token_instance;

                    return db.user
                        .findByToken(token);
                })
                .then(function (user) {
                    req.user = user;
                    next();
                })
                .catch(function (e) {
                    res.status(401).send();
                });
        }
    };
};