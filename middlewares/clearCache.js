const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {

    // @ it makes sure that we call the next function which in this case
    // @ is route handler i.e. all the route process is completed first
    await next();

    // @ after route tasks is complete than we will clear our cache
    clearHash(req.user.id);
    
}