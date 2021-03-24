//verify that sender is can accses and is vail user
const controller = require('./controller');
const verifyer = require('../../securityUtil')
const path = require('path');
const Resize = require('../resize');
const multer = require('multer');
const { stat } = require('fs');
const upload = multer({
  limits: {
    fileSize: 4 * 1024 * 1024,
  }
});

app.post("/addreview", async function (req, res) {
  let state = await controller.checkOrderBuyer(req.query.orderid, req.user.id)
  if (state == 1) {
    let respon = await controller.updateState({ id: req.user.id, orderid: req.query.orderid })
    if (respon) {
      controller.updateReviews(req)
      res.status(200)
    }
  }
  res.status(400)

  //TODOSECURITY
  //Verify order is right state 
  //verfiy buyer and can review order

  //add review and update orderstate to 2
  //req orderid and userid
});
app.post("/orderSent", async function (req, res) {
  let state =  await controller.checkOrderSeller(req.query.orderid, req.user.id)
  if (state == 0) {
    let respon = await controller.updateState({ id: req.user.id, orderstate: 1 })
    if (respon) {
      res.status(200)
    }
  }
  res.status(400)
  //Updates order state to 1
  //req orderid and userid veify that is seller and can change tis orderid
});


exports.chat = async function chat(app, io) {
  app.post('/chatImage', upload.single('file'), async function (req, res) {
    const imagePath = path.join('./images');
    const fileUpload = new Resize(imagePath);
    if (!req.file) {
      console.log("image upload error")
      res.status(400).json({ error: 'Please provide an image' });
      return
    }
    console.log("image upload")
    if (sessobj) {
      const filename = await fileUpload.save(req.file.buffer);
      let sessobj = await controller.verifysession(msg[0])
      let chatroom = await controller.getRoomWhereOrderID(msg[1].orderid)
      if (filename) {
        let savemessage = {
          text: null,
          image: filename,
          name: sessobj.nick,
          roomid: chatroom.roomid,
          userid: sessobj.id
        }
        controller.saveMessage(savemessage)
        res.status(200).json(filename);
      }
    }
    res.status(400).json({ error: 'Upload failed' });
  });

  app.get("/activeRooms", async function (req, res) {

    let getallroomns = await controller.getChats(req.user.id)

    res.status(200).json(getallroomns);
  });

  app.get("/getChat", async function (req, res) {
    console.log(req.query.listingID)
    let getallroomns = await controller.getOrder(req.query.listingID, req.user.id)
    console.log(getallroomns)
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
      console.log(msg)
      let sessobj = await controller.verifysession(msg[0])
      if (sessobj) {
        let chatroom = await controller.getRoomWhereOrderID(msg[1].orderid)
        console.log("joined and auth")
        console.log(chatroom.roomid);
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
          image: "asd",
          name: sessobj.nick,
          orderid: msg[1].orderid
        }
        let savemessage = {
          text: msg[1].text,
          image: "asd",
          name: sessobj.nick,
          roomid: chatroom.roomid,
          userid: sessobj.id
        }
        controller.saveMessage(savemessage)
        console.log("send to")
        console.log(chatroom.roomid);
        io.to(chatroom.roomid).emit('msg', returnmessage);
        //socket.broadcast.emit('msg', returnmessage);
      }

    });
    socket.on('disconnect', function () {

    });
  });
};

