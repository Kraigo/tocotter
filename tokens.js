var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.DATABASE_URL || "DATABASE_URL", {
    logging: false,
    dialectOptions: {
        ssl: true
    }
});

var Tokens = sequelize.define('tokens', {
    requestToken: Sequelize.STRING,
    requestTokenSecret: Sequelize.STRING,
    accessToken: Sequelize.STRING,
    accessTokenSecret: Sequelize.STRING
});

Tokens.destroy({ where: { accessToken: null } });

//Tokens.sync({force: true});
Tokens.sync();

module.exports = Tokens;