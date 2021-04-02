//verify that sender is can accses and is vail user
const controller = require('./controller');
const verifyer = require('../../securityUtil')
const path = require('path');
const Resize = require('../resize');
const multer = require('multer');
const { stat } = require('fs');
const { log } = require('console');
const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
});
exports.chat = async function chat(app, io) {
  app.post("/addreview", async function (req, res) {
    if (typeof req.user === 'undefined') {
      console.log("addreview user failed");
      res.status(400)
      return
    }
    if (typeof req.body.orderid === 'undefined') {
      console.log("addreview orderid failed");
      res.status(400)
      return
    }
    if (isNaN(req.body.orderid)) {
      console.log("addreview orderid failed NaN");
      res.status(400)
      return 
    }

    let state = await controller.checkOrderBuyer(req.body.orderid, req.user.id)
    if (state == 1) {
      let foo = { id: req.body.orderid, orderstate: 2 }
      let respon = await controller.updateState(foo)
      if (respon) {
        controller.updateReviews(req.body.orderid, req.body.rating)
        res.status(200)
      }
    }
    console.log("addreview controllerfail");
    res.status(400)
  });

  app.post("/orderSent", async function (req, res) {
    if (typeof req.user === 'undefined') {
      console.log("orderSent user failed");
      res.status(400)
      return
    }

    if (typeof req.body.orderid === 'undefined') {
      console.log("orderSent orderid failed");
      res.status(400)
      return
    }

    if (isNaN(req.body.orderid)) {
      console.log("orderSent orderid failed NaN");
      res.status(400)
      return 
    }

    let state = await controller.checkOrderSeller(req.body.orderid, req.user.id)
    if (state == 0) {
      let respon = await controller.updateState({ id: req.body.orderid, orderstate: 1 })
      if (respon) {
        res.status(200)
      }
    }
    console.log("orderSent controller fail");
    res.status(400)
    //Updates order state to 1
    //req orderid and userid veify that is seller and can change tis orderid
  });
  app.post('/chatImage', upload.single('file'), async function (req, res) {
    const imagePath = path.join('./images');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      res.status(400).json({ error: 'Please provide an image' });
      return
    }
    const filename = await fileUpload.save(req.file.buffer);
    let chatroom = await controller.getRoomWhereOrderID(req.body.orderid)
    if (filename) {
      let savemessage = {
        text: "testimage",
        image: filename,
        name: req.user.nick,
        roomid: chatroom.roomid,
        userid: req.user.id
      }
      controller.saveMessage(savemessage)
      let returnmessage = {
        text: req.body.text,
        image: filename,
        name: req.user.nick,
        orderid: req.body.orderid
      }
      io.to(chatroom.roomid).emit('msg', returnmessage);
      //io.sockets.in(chatroom.roomid).emit('msg', savemessage);
    }

  });

  app.get("/activeRooms", async function (req, res) {

    let getallroomns = await controller.getChats(req.user.id)

    res.status(200).json(getallroomns);
  });

  app.get("/getChat", async function (req, res) {
    let getallroomns = await controller.getOrder(req.query.listingID, req.user.id)
    res.status(200).json([getallroomns]);

  });


  app.get("/activeRoomsSeller", async function (req, res) {

    let getallroomns = await controller.getChatsSel(req.user.id)

    res.status(200).json(getallroomns);
  });
  io.on('connection', (socket) => {

    socket.on('disconnect', function () {

    });

    socket.on('auth', async function (msg) {
      let sessobj = await controller.verifysession(msg[0])
      if (sessobj) {
        let chatroom = await controller.getRoomWhereOrderID(msg[1].orderid)
        socket.join(chatroom.roomid);
      }
      //socket.broadcast.emit('msg', returnmessage);
    });


    socket.on('chat message', async function (msg) {
      let sessobj = await controller.verifysession(msg[0])
      if (sessobj) {
        let chatroom = await controller.getRoomWhereOrderID(msg[1].orderid)
        let returnmessage = {
          text: msg[1].text,
          name: sessobj.nick,
          orderid: msg[1].orderid
        }
        let savemessage = {
          text: msg[1].text,
          name: sessobj.nick,
          roomid: chatroom.roomid,
          userid: sessobj.id
        }
        controller.saveMessage(savemessage)
        io.to(chatroom.roomid).emit('msg', returnmessage);
        //socket.broadcast.emit('msg', returnmessage);
      }

    });
    socket.on('disconnect', function () {

    });
  });
};

