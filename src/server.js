
//what connects all small parts and used for testing and give out express app to routes and middelware
const express = require('express');
const dbstart = require('../db/index');
const models = require('../db/models');
const routes = require('./api/componentRoutes');
const middelware = require('./middleware');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

async function modelinit(){
    await models.userModel.sync({ alter: true });
    await models.inRoom.sync({ alter: true });
    await models.chatRoom.sync({ alter: true });
    await models.messages.sync({ alter: true });
    await models.orders.sync({ alter: true });
    await models.listings.sync({ alter: true });
    await models.inListing.sync({ alter: true });
    await models.products.sync({ alter: true });
}
modelinit()
middelware.initRestMiddleware(app);
dbstart.start();
console.log("testrun");
routes.initRestRoutes(app,io);

exports.app = http