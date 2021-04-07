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
      res.status(400).json({ error: 'addreview user failed' });
      return
    }
    if (typeof req.body.orderid === 'undefined') {
      console.log("addreview orderid failed");
      res.status(400).json({ error: 'addreview orderid failed' });
      return
    }
    if (isNaN(req.body.orderid)) {
      console.log("addreview orderid failed NaN");
      res.status(400).json({ error: 'addreview orderid failed NaN' });
      return
    }

    let state = await controller.checkOrderBuyer(req.body.orderid, req.user.id)
    if (state == 1) {
      let foo = { id: req.body.orderid, orderstate: 2 }
      let respon = await controller.updateState(foo)
      if (respon) {
        controller.updateReviews(req.body.orderid, req.body.rating)
        res.status(200).json({ error: false });
      }
    }
    console.log("addreview controllerfail");
    res.status(400).json({ error: 'addreview controllerfail' });
  });

  app.post("/orderSent", async function (req, res) {
    if (typeof req.user === 'undefined') {
      console.log("orderSent user failed");
      res.status(400).json({ error: 'orderSent user failed' });
      return
    }

    if (typeof req.body.orderid === 'undefined') {
      console.log("orderSent orderid failed");
      res.status(400).json({ error: 'orderSent orderid failed' });
      return
    }

    if (isNaN(req.body.orderid)) {
      console.log("orderSent orderid failed NaN");
      res.status(400).json({ error: 'orderSent orderid failed NaN' });
      return
    }

    let state = await controller.checkOrderSeller(req.body.orderid, req.user.id)
    if (state == 0) {
      let respon = await controller.updateState({ id: req.body.orderid, orderstate: 1 })
      if (respon) {
        res.status(200).json({ error: false });
        return
      }
    }
    console.log("orderSent controller fail");
    res.status(400).json({ error: 'orderSent controller fail' });
    //Updates order state to 1
    //req orderid and userid veify that is seller and can change tis orderid
  });
  app.post('/chatImage', upload.single('file'), async function (req, res) {
    //secstuff
    //check for undefined to avoid crash
    //check for valid session aka loggedin and valid account
    //check if seller/buyer in order by orderid
    //auth and join chatroom so can get chatmessages with socket.join
    const imagePath = path.join('./images');
    const fileUpload = new Resize(imagePath);
    if (typeof req.file === 'undefined') {
      console.log("chat file failed");
      res.status(400).json({ error: 'no file' });
      return
    }
    if (!req.file) {
      res.status(400).json({ error: 'Please provide an image' });
      return
    }
    if (typeof req.user === 'undefined') {
      console.log("orderSent user failed");
      res.status(400).json({ error: 'orderSent user failed' });
      return
    }

    if (typeof req.body.orderid === 'undefined') {
      console.log("orderSent orderid failed");
      res.status(400).json({ error: 'orderSent orderid failed' });
      return
    }
    if (isNaN(req.body.orderid)) {
      console.log("orderSent orderid failed NaN");
      res.status(400).json({ error: 'orderSent orderid failed NaN' });
      return
    }
    if (await controller.checkOrderSeller(req.user.id, req.body.orderid) || await controller.checkOrderSeller(req.user.id, req.body.orderid)) {
      console.log("failed creatListing controller");
      return false
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
    if (typeof req.user === 'undefined') {
      console.log("activeRooms user failed");
      res.status(400).json({ error: 'activeRooms user failed' });
      return
    }
    let getallroomns = await controller.getChats(req.user.id)

    res.status(200).json(getallroomns);
  });

  app.get("/getChat", async function (req, res) {
    let getallroomns = await controller.getOrder(req.query.listingID, req.user.id)
    res.status(200).json([getallroomns]);

  });


  app.get("/activeRoomsSeller", async function (req, res) {
    if (typeof req.user === 'undefined') {
      console.log("activeRoomsSeller user failed");
      res.status(400).json({ error: 'activeRoomsSeller user failed' });
      return
    }
    let getallroomns = await controller.getChatsSel(req.user.id)
    res.status(200).json(getallroomns);
  });
  io.on('connection', (socket) => {

    socket.on('disconnect', function () {

    });

    socket.on('auth', async function (msg) {
      //secstuff
      //check for undefined to avoid crash
      //check for valid session aka loggedin and valid account
      //check if seller/buyer in order by orderid
      //auth and join chatroom so can get chatmessages with socket.join 
      /*
      if (typeof msg[0] === 'undefined') {
        console.log("chatauth  failed");
        return
      }
      if (typeof msg[1] === 'undefined') {
        console.log("chatauth  failed");
        return
      }
      if (!msg[0]) {
        console.log("chatauth  failed");
        return
      }
      if (!msg[1]) {
        console.log("chatauth  failed");
        return
      }
      let sessobj = await controller.verifysession(msg[0])
      if(!sessobj){
        console.log("sessobj");
        return
      }
      if (await controller.checkOrderSeller(sessobj.id, msg[1].orderid) || await controller.checkOrderBuyer(sessobj.id, msg[1].orderid)) {
        console.log("chat ok");
      }
      else {
        console.log("failed chat auth");
        return
      }
*/
      if (sessobj) {
        let chatroom = await controller.getRoomWhereOrderID(msg[1].orderid)
        socket.join(chatroom.roomid);
      }
      //socket.broadcast.emit('msg', returnmessage);
    });
    socket.on('chat message', async function (msg) {
      //secstuff
      //check for undefined to avoid crash
      //check for valid session aka loggedin and valid account
      //check if seller/buyer in order by orderid
      console.log(1);
      if (typeof msg[0] === 'undefined' || typeof msg[1] === 'undefined') {
        console.log("chatmessage  failed");
        return
      }
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
        if (await controller.checkOrderSeller(sessobj.id, msg[1].orderid) || await controller.checkOrderSeller(sessobj.id, msg[1].orderid)) {
          console.log("failed creatListing controller");
          return false
        }
        controller.saveMessage(savemessage)
        io.to(chatroom.roomid).emit('msg', returnmessage);
        return
        //socket.broadcast.emit('msg', returnmessage);
      }
      console.log("chat auth failed")
    });
    socket.on('disconnect', function () {
    });
  });
};

