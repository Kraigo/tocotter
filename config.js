var domain =  process.env.DOMAIN || 'http://localhost:8080';

var twitterAcess = {
    // From your app

    consumerKey: process.env.CONSUMER_KEY || 'Lrr2nUJmduJHZmRQogUzaJFgU',
    consumerSecret: process.env.CONSUMER_SECRET || 'cz57fGNbUEqiJvjEAgXtP9KvpcNkwvJWofspXLeLL0P6pmlM18',
    callback: domain + '/callback'
};

module.exports = {
    twitterAccess: twitterAcess
};