const Redis = require('ioredis');
const fs = require('fs');
const keys = require('./config/keys');

// @ If condition is extra config to keep up with the course
let redisClient;

if(process.env.NODE_ENV !== 'ci') {	
	// Connecting to redis server
	redisClient = new Redis({
		host: 'redis-14707.c299.asia-northeast1-1.gce.cloud.redislabs.com',
		port: 14707,
		password: 'dryVNe4Vk7z0TwnEpExGoQxBk6eEscpe'
	});
}
else {
	// Connecting to redis on the local system
	redisClient = Redis.createClient(keys.redisURL);
}

module.exports = redisClient;