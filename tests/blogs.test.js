const Page = require('./helpers/page');

let page;
beforeEach(async () => {
    page = await Page.build();
    await page.goto('localhost:3000');
}, 50000);

afterEach(async () => {
    await page.close();
});


describe('When logged in', async () => {
    // @ only for tests inside describe statement
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('When logged in, can see blog create from', async () => {
        const label = await page.getText('form label');
        expect(label).toEqual('Blog Title');
    });

    describe('And using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('form button');
        });

        test('Submitting takes user to review screen', async () => {
            const text = await page.getText('h5');
            expect(text).toEqual('Please confirm your entries');
        });

        test('Submitting saves the article to index page', async () => {
            await page.click('button.green');
            await page.waitFor('.card');

            const title = await page.getText('.card-title');
            const content = await page.getText('p');

            expect(title).toEqual('My Title');
            expect(content).toEqual('My Content');
        });
    });

    describe('And using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        test('the form shows an error message', async () => {
            const titleError = await page.getText('.title .red-text');
            const contentErr = await page.getText('.content .red-text');
            expect(titleError).toEqual('You must provide a value');
            expect(contentErr).toEqual('You must provide a value');
        });
    });
});

// @ one more way of doing this is using axios ofcourse
// describe('When user is not logged in', async () => {

//     test('User cannot create blog posts', async () => {
//         const result = await page.evaluate(() => {
//             return fetch('/api/blogs', {       //fetch returns raw data
//                 methods: 'POST',
//                 credentials: 'same-origin',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ title: 'Blog cant be created', content: 'My Content' })
//             }).then(res => res.json());
//         });

//         console.log(result);
//         expect(result).toEqual({ error: 'You must log in!' });
//     });

// ! this test for some reason is failing i don't think there's typo or logical error
// ! but rather something from library side
//     test('User cannot get lists of posts', async () => {
//         const result = await page.evaluate(() => {
//             return fetch('/api/blogs', {
//                 methods: 'GET',
//                 credentials: 'same-origin',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }).then(res => res.json())
//         });

//         expect(result).toEqual({ error: 'You must log in!' });
//     });
// });


describe('When user is not logged in', async () => {

    // Without actions can be done as well
    // test('User cannot create blog posts', async () => {
    //     const result = await page.post('/api/blogs', { title: 'Blog cant be created', content: 'My Content' });
    //     expect(result).toEqual({ error: 'You must log in!' });
    // });

    // test('User cannot get lists of posts', async () => {
    //     const result = await page.get('/api/blogs');
    //     expect(result).toEqual({ error: 'You must log in!' });
    // });


    // Making it more convenient
    // This way is faster as well becoz all requests take place at same time
    const actions = [
        {
            "path": "/api/blogs",
            "method": "POST",
            "data": { title: 'Title', content: 'Content' }
        },
        {
            "path": "/api/blogs",
            "method": "GET"
        }
    ];

    test("Blogs related actions are prohibited", async () => {
        const results = await page.execRequests(actions);
        for (const res of results) 
            expect(res).toEqual({ error: 'You must log in!' });
    })
});