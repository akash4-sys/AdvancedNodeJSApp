const Redis = require('ioredis');
const fs = require('fs');

const redisClient = new Redis({
	host: 'redis-14707.c299.asia-northeast1-1.gce.cloud.redislabs.com',
	port: 14707,
	password: 'dryVNe4Vk7z0TwnEpExGoQxBk6eEscpe'
});

module.exports = redisClient;