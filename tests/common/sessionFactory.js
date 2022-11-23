// @ Session Factory is just a random name nothing to do with any package

// @ fake signin for testing purposes
// this is just a page to login as we need to login for almost every test

const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

// @ In mongodb user._id is not a string but rather a javascript object

module.exports = (user) => {
    const Buffer = require('safe-buffer').Buffer;
    const sessionObject = {
        passport: {
            user: user._id.toString()
        }
    };
    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const sig = keygrip.sign('session=' + sessionString);
    return { session: sessionString, sig };
}