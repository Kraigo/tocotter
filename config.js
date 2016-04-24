var twitterAcess = {
    // From your app

    consumerKey: process.env.CONSUMER_KEY || 'CONSUMER KEY',
    consumerSecret: process.env.CONSUMER_SECRET || 'CONSUMER SECRET KEY',
    callback: 'http://localhost:8080/callback'
};

module.exports = {
    twitterAccess: twitterAcess
};