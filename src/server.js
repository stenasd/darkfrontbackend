
//what connects all small parts and used for testing and give out express app to routes and middelware
const express = require('express');
const dbstart = require('../db/index');
const models = require('../db/models');
const routes = require('./api/componentRoutes');
const middelware = require('./middleware');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"]
  }
});
async function modelinit() {
  await models.userModel.sync({ alter: true });
  await models.inRoom.sync({ alter: true });
  await models.messages.sync({ alter: true });
  await models.orders.sync({ alter: true });
  await models.listings.sync({ alter: true });
  await models.inListing.sync({ alter: true });
  await models.products.sync({ alter: true });
  await models.refkey.sync({ alter: true });
  await models.prodInOrder.sync({ alter: true });
  await models.transactions.sync({ alter: true });
  await models.usedAdresses.sync({ alter: true });
  await models.ownedTXID.sync({ alter: true });
}
modelinit();
middelware.initRestMiddleware(app, io);
dbstart.start();
console.log("testrun");
routes.initRestRoutes(app, io);
exports.app = http