//verify that sender is can accses and is vail user
const controller = require('./controller');
const verifyer = require('../../securityUtil')
exports.chat = async function chat(app, io) {
  //todo make checker so only the ones thats in it can accses it


  app.get("/activeRooms", async function (req, res) {

    let getallroomns = await controller.getChats(req.user.id)

    res.status(200).json(getallroomns);
  });

  app.get("/getChat", async function (req, res) {
    console.log(req.query.listingID)
    let getallroomns = await controller.getOrder(req.query.listingID,req.user.id)
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

