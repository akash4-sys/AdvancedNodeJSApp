// @ I created this file just to keep index.js clean

const redisClient = require('./redis.js');

redisClient.set('key', 'value');
async function print(key) {
	try{
		const val = await redisClient.get(key);
		console.log(val);
	}catch(err){
		console.log(err);
	}
}

print('key');
print('keyThatDoesNotExists');


// ? otherway of doing the above
redisClient.get('noKey', (err, result) => {
	if(err)
		console.log(err);
	else
		console.log(result);
});


// ? one more way of doing this
redisClient.get('key', console.log);


// ? nested hashmap

redisClient.hset('india', 'blue', 'flag')
redisClient.hset('india', 'purple', 'not in flag')
redisClient.hget('india', 'blue', console.log)
redisClient.hget('india', 'purple', console.log)

// ? set object as a value
redisClient.set('name', JSON.stringify({userid : 'id'}));
redisClient.get('name', console.log);