//verify that sender is can accses and is vail user
const controller = require('./controller');
const verifyer = require('../../securityUtil')
exports.chat = async function chat(app, io) {
  //todo make checker so only the ones thats in it can accses it

  app.get("/activeRooms", async function (req, res) {
    console.log("getallrooms");
    let getallroomns = await controller.getChats(req.user.id)
    console.log(getallroomns)
    res.status(200).json(getallroomns);
  });
  app.get("/activeRoomsSeller", async function (req, res) {
    console.log("getallrooms");
    let getallroomns = await controller.getChatsSel(req.user.id)
    console.log(getallroomns)
    res.status(200).json(getallroomns);
  });
  io.on('connection', (socket) => {
    //socket on login to get subscribed rooms
    console.log("connection")
    //get rooms 
    socket.on('chat message', async function (msg) {
      console.log(msg);
      //todo check for validity
      //broadcast to right room
      let sessobj = await controller.verifysession(msg[0])
      console.log(msg[1].orderid)
      let chatroom = await controller.getRoomWhereOrderID(msg[1].orderid)
      console.log(chatroom)
      console.log(sessobj)
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
        roomid:chatroom.roomid,
        userid:sessobj.id
      }
      controller.saveMessage(savemessage)
      socket.broadcast.emit('msg', returnmessage);
    });
    socket.on('disconnect', function () {
      console.log('Got disconnect!');
    });
  });
};

