var domain =  process.env.DOMAIN || 'http://localhost:8080';

var twitterAcess = {
    // From your app

    consumerKey: process.env.CONSUMER_KEY || 'CONSUMER KEY',
    consumerSecret: process.env.CONSUMER_SECRET || 'CONSUMER SECRET KEY',
    callback: domain + '/callback'
};

module.exports = {
    twitterAccess: twitterAcess
};