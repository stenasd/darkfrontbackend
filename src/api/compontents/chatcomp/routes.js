//verify that sender is can accses and is vail user
const controller = require('./controller');
const verifyer = require('../../securityUtil')
exports.chat = async function chat(app, io) {
  //todo make checker so only the ones thats in it can accses it
  app.get("/chathistory", async function (req, res)  {

    //res.status(200).json(controller.getchathistory(req.body.roomid));
    
    let samplejson = {
      data:[{      
      id:"1",
      roomid:"1",
      userid:"2",
      text:"hello history",
      image:null
    },{      
      id:"1",
      roomid:"1",
      userid:"2",
      text:"hello history",
      image:null
    },{      
      id:"1",
      roomid:"1",
      userid:"2",
      text:"hello history",
      image:null
    },]
    }
    res.status(200).json(samplejson);
  });

  app.get("/activeRooms", async function (req, res)   {
    let getallroomns = await controller.getChats(req.user.id)
    res.status(200).json(getallroomns);
  });
  
  io.on('connection', (socket) => {
    //get rooms 
    socket.on('chat message', async function(msg){
      //todo check for validity
      //broadcast to right room
      let sessobj = await controller.verifysession(msg[0])
      let userid = JSON.parse(sessobj.data)
      socket.broadcast.emit('msg', samplejson);
    });
  });
};

