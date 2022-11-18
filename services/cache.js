const mongoose = require('mongoose');
const redisClient = require('../redis');

const exec = mongoose.Query.prototype.exec;

// we are adding a cache function in mongoose queries
// it's totally custom
mongoose.Query.prototype.cache = function (options = {}) {
    // creating a custom variable in query instance
    this.useCache = true;

    // we'll stringify it because we want the string as a key
    this.hashKey = JSON.stringify(options.key || 'default')

    // to make it chainable like all the other mongoose query methods like
    // .find .limit etc
    return this;
}

// don't use arrow function that'll make `this` call to outside to scope
// of exec
mongoose.Query.prototype.exec = async function () {
    if(!this.useCache)
        return exec.apply(this, arguments);
    
    console.log('I m about to run a query');
    console.log('This query is being cached');

    // @ `this` here is the current query we are running
    console.log(this.getQuery());
    console.log(this.mongooseCollection.name);

    // ? Object.assign is used to copy one object to another
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name
        })
    );

    // console.log(key);

    // see if we do have a value in  redis
    const cachedValue = await redisClient.hget(this.hashKey, key);

    if(cachedValue) {
        const doc = JSON.parse(cachedValue);
        return Array.isArray(doc) ? doc.map(d => new this.model(d)) : new this.model(doc);
    }

    // otherwise, issue the query and store the result in redis
    const res = await exec.apply(this, arguments);
    redisClient.hset(this.hashKey, key, JSON.stringify(res), 'EX', 10);
    return res;
};



module.exports = {

    // A function to delete all the data associated with a given key
    clearHash(hashKey) {
        redisClient.del(JSON.stringify(hashKey));
    }
    
}