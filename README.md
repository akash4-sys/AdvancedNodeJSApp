# NodeJS Application with REDIS and JEST
This project is from a udemy course for learning purposes.
## There are two ways to connect to redis
---
### First
Go to redis cloud click on connect and
```
const Redis = require('ioredis');
const fs = require('fs');

const redis = new Redis({
    host: 'redis-14707.c299.asia-northeast1-1.gce.cloud.redislabs.com',
    port: 14707,
    password: 'dryVNe4Vk7z0TwnEpExGoQxBk6eEscpe'
});
```

copy this from there.

Password is in the redis stack section scroll down to security.
Install necessary dependencies.


### Second

Type node in your project terminal And then there are some commands.
I this will only work if you have redis installed in your system.
It is bit difficult for windows system.

type this in your terminal

```
node
> const redis = require('redis');
> const redisUrl = 'redis://127.0.0.1:6379';
> const client = redis.createClient(redisUrl);
> client.set('key', 'value');

```


## Redis
---

Nested Key Value pair
`hset` and `hget`


```
const example = {
    india:{
        orange: 'yes',
        white: 'green'
    },
    america:{
        blue:'yes',
        stars:'yes'
    }
}
```

1. stringify any object to store it in redis
```
redisClient.set('name', JSON.stringify({userid : 'id'}));
```

JSON.parse() to undo stringify


2. `redisClient.flushall()`
3. `redisClient.set('key', value, 'EX', 5)`
    - this line has lifespan of 5 seconds

## Redis caching strategy
---

In mongoose a query is triggered using - 
 - `query.exec((err, res) => console.log(res))`
 - same as `query.then(res => console.log(res))`
 - same as `const res = await query`


pseudo code
 ```
 query.exec = function (){
    const res = client.get('key);

    if(key)
        return res;

    <!-- otherwise issue the query as normal -->
    const res = runTheOriginalFunction();

    // then save the value in redis

    client.set(key, res);

    <!-- and return the value like it normally would -->
    return res;
 }
 ```


2. Delete the data every 15 or 10 minutes to make sure that cached data is upto date.

3. mongooose query has a function
    - `query.getOptions()`
    - this returns a object with bunch of properties
    - we can convert it to string and use it as key
    - because it's gonna be a unique string every time

4. Checkout the `cache.js` file in your services directory.