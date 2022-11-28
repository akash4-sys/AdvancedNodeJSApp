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
            get: function (target, property) {
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
        await this.page.goto('localhost:3000/blogs');
    }

    async getText(selector) {
        return await this.page.$eval(selector, el => el.innerHTML);
    }

    get(path) {
        // evaluate function converts the function inside it's callback
        // into string, so if u simply pass path as parameter you will get path is not defined
        // @ _path gets it values from argument path in evaluate
        return this.page.evaluate((_path) => {
            return fetch(_path, {
                methods: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
        }, path);
    }

    post(path, data) {
        return this.page.evaluate((_path, _data) => {

            return fetch(_path, {
                methods: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_data)
            }).then(res => res.json());

        }, path, data);
    }

    execRequests(actions) {

        // it will combine the array of promises from the map into a single promise
        // and when they resolve it will return it
        return Promise.all(
            actions.map(({ method, path, data }) => {
                // function call to either get or post is made and they return promises
                return this[method](path, data);
            })
        );
    }
};

module.exports = CustomPage;