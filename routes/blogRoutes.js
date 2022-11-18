const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const Blog = mongoose.model('Blog');

// const redisClient = require('../redis');
// const { clearHash } = require('../services/cache');
const clearCache = require('../middlewares/clearCache');

module.exports = app => {
	app.get('/api/blogs/:id', requireLogin, async (req, res) => {
		const blog = await Blog.findOne({
			_user: req.user.id,
			_id: req.params.id
		});

		res.send(blog);
	});



	// ? Normal version
	app.get('/api/blogs', requireLogin, clearCache, async (req, res) => {
		const blogs = await Blog.find({ _user: req.user.id }).cache({
			key: req.user.id
		});
		res.send(blogs);
	});


	// ? Updated version
	// @ this way of doing things is good for learning but
	// @ it won't work as intended and there'll be no issue's either
	// @ read comment for further explanation
	// app.get('/api/blogs', requireLogin, async (req, res) => {

	//   // If we have cached data for this request
	//   // we'll return that data right away
	//   // ! In this caching method we are not updating the cached request

	//   const cachedBlogs = await redisClient.get(req.user.id);

	//   if (cachedBlogs) {

	//     console.log('Serving from cache')
	//     res.send(cachedBlogs);

	//   } else {

	//     // else we make request and cache it

	//     // Instead running this request again and again which can be time consuming
	//     // We are going to cache it using redis
	//     const blogs = await Blog.find({ _user: req.user.id });
	//     redisClient.set(req.user.id, blogs);
	//     redisClient.get(req.user.id, console.log);
	//     res.send(blogs);

	//   }

	// });

	app.post('/api/blogs', requireLogin, clearCache, async (req, res) => {
		const { title, content } = req.body;

		const blog = new Blog({
			title,
			content,
			_user: req.user.id
		});

		try {
			await blog.save();
			res.send(blog);

			// this is for clearing the cache associated with this user
			// clearHash(req.user.id);

		} catch (err) {
			res.send(400, err);
		}
	});
};
