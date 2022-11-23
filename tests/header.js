// @ So this was originally the headers.test.js but due to a lot of the changes
// @ i left this file as it is becoz of all the comments

const puppeteer = require('puppeteer');
const sessionFactory = require('./common/sessionFactory');
const userFactory = require('./common/userFactory');

// @Term Headless means without GUI.

// ! In this test I have set Timeout of 50000ms (50s) becoz default timeout is 5s and by the time
// ! chromium starts 5s passes and test fails with async timeout error
let browser, page;
beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
}, 50000);

afterEach(async () => {
    await browser.close();
});

test('Launch Chromium Instance', async () => {

    // @ Puppeteer converts el => el.innerHTML to string and passes it to the node js and then node converts it back to function, executes it 
    // @ and returns the result again in form of string to the node runtime
    // @ dollar sign is nothing special it's just part of function name, we can define a function with $ as well
    // a.brand-logo is a css selector
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
});


test('clicking login triggers google oauth login', async () => {
    await page.click('.right a');
    const url = page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

// @ fake signin for testing purposes
test.only('When signed in, check for logout button', async () => {
    // @ removed from this file and moved in sessionFactory as it is needed in every test
    // const userID = '636cd9f20b85f55ad0199ac0';      //from mongodb
    // const Buffer = require('safe-buffer').Buffer;
    // const sessionObject = {
    //     passport: {
    //         user: userID
    //     }
    // }
    // const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    // const Keygrip = require('keygrip');
    // const keys = require('../config/keys');
    // const keygrip = new Keygrip([keys.cookieKey]);
    // // Here session= is there becoz that's how original library does things
    // const sig = keygrip.sign('session=' + sessionString);


    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    console.log(session, sig);

    // ! cookie needs to be set on our website page so make sure to first goto to it

    // these are the original name used by google oauth
    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });

    // refresh
    await page.goto('localhost:3000');

    // ! Here my application is able to pass the test probably becoz of the timeout i have put in before each but otherwise this
    // ! test should fail as we need to wait for anchor tag to appear on page, so
    
    await page.waitFor('a[href="/auth/logout"]');
    const logoutText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(logoutText).toEqual('Logout');
});