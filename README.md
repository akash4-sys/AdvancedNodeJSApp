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


## Test with Jest and Puppeteer
---

### Create a Fake session For by passing authentication during testing

- First logout if you are logged in.
- Then click to log in.
- Choose the account and whatever to log in. Keep the network tab open.

- Or just go to application tab in chrome and check your cookie from there if you know that name.

- First link or a callback link in the network tab after successful login will have setcookie parameter in headers.
- Copy the cookie value which will be something like *ma9823698ksanfdasjkhf09817234*.


#### Then go to terminal and type the following

```
<!-- Type Node in terminal and press enter -->
node

> const session = `eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjM3NzgwNDgyYWQ4MmEyNGU0MGFlMjNjIn19`
undefined
> const Buffer = require('safe-buffer').Buffer;
undefined
> Buffer.from(session, 'base64').toString('utf8');
'{"passport":{"user":"637780482ad82a24e40ae23c"}}'
>
```

*This won't work completely as there is also session signature*

Keygrip is responsible for generating session from session key.
### To generate signature from session
```
const session = 'eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNjM3NzgwNDgyYWQ4MmEyNGU0MGFlMjNjIn19'
undefined
> const keygrip = require('keygrip')
undefined
> const Keygrip = new keygrip(['123123123'])
undefined
> Keygrip.sign('session=' + session)
'gqjF8b-KBG9Sg31VgPT6b2c6yfw'

<!-- Reverifying the session using session key -->
> Keygrip.verify('session=' + session, 'gqjF8b-KBG9Sg31VgPT6b2c6yfw')
true
```


### Updating puppeteer library
---

Even with the userFactory setup and Session Factory setup loging in every time can be very repetitive task. So one way to do this is 
to update the `class page in puppeteer lib.`

To do that -
```
const Page = require('puppeteer/lib/Page');
Page.protoype.login = async function() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });
    await page.goto('localhost:3000');
}
```

`This will work absolutly fine.`