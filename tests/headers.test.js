// @ all the login logic and browser startup logic shifted here
const Page = require('./helpers/page');

let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
}, 50000);

afterEach(async () => {
    await page.close();
});

test('Launch Chromium Instance', async () => {
    const text = await page.getText('a.brand-logo');
    expect(text).toEqual('Blogster');
});


test('clicking login triggers google oauth login', async () => {
    await page.click('.right a');
    const url = page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, check for logout button', async () => {
    await page.login();
    await page.waitFor('a[href="/auth/logout"]');
    const logoutText = await page.getText('a[href="/auth/logout"]');
    expect(logoutText).toEqual('Logout');
});