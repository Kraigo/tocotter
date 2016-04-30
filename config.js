var twitterAcess = {
    // From your app

    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callback: process.env.DOMAIN+ '/callback'
};
var databaseUrl = process.env.DATABASE_URL;

module.exports = {
    twitterAccess: twitterAcess,
    databaseUrl: databaseUrl
};