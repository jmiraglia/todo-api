var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function (sql, DataTypes) {
    var user = sql.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [8, 100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashed_password = bcrypt.hashSync(value, salt);

                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashed_password);
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON();
                return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
            }
        },
        classMethods: {
            authenticate: function(body){
                return new Promise(function(resolve, reject){
                    if (typeof body.email !== 'string' || typeof body.password !== 'string') {
                        return reject();
                    }

                    user
                        .findOne(
                            {
                                where: {
                                    email: body.email
                                }
                            })
                        .then(function (user) {
                            if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
                                return reject();
                            }

                            resolve(user);
                        })
                        .catch(function (e) {
                            reject();
                        });
                })
            }
        }
    });

    return user;
};