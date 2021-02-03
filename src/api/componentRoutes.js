//import and init all component routes
const exampleroute = require('./compontents/chatcomp/routes');
const passportroute = require('./compontents/passport/routes');
exports.initRestRoutes = function (app,io) {
    exampleroute.chat(app,io); 
    passportroute.route(app)
};