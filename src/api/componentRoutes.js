//import and init all component routes
const exampleroute = require('./compontents/chatcomp/routes');
const passportroute = require('./compontents/passport/routes');
const listingroute = require('./compontents/listings/route')
exports.initRestRoutes = function (app,io) {
    exampleroute.chat(app,io); 
    passportroute.route(app)
    listingroute.routes(app)
};