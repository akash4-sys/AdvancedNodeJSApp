const puppeteer = require('puppeteer');
const sessionFactory = require('../common/sessionFactory');
const userFactory = require('../common/userFactory');

// @ In this file we are going to customize the page class from the
// @ puppeteer to make the login easier

class CustomPage {
    // @ benefit of making a function static is that we can call it without
    // @ having to create a new instance

    static async build() {
        const browser = await puppeteer.launch({
            headless: false
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        // Proxy is es5 feature and here it is being used to combine
        // customPage and page class from puppeteer
        return new Proxy(customPage, {

            // here property is the function that we want to call and target basically refers to customPage itself (so basically useless)
            // customPage[property] means a property function of customPage class to be called.
            get: function(target, property) {
                return customPage[property] || browser[property] || page[property];
            }
        });
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);
        await this.page.setCookie({ name: 'session', value: session });
        await this.page.setCookie({ name: 'session.sig', value: sig });
        await this.page.goto('localhost:3000');
    }

    async getText(selector) {
        return await this.page.$eval(selector, el => el.innerHTML);
    }
};

module.exports = CustomPage;