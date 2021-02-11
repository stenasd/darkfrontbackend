//api routs for chat history

//user got a socket thats saved and backend keeps track on all messages and send it to correct

//get roomid and and userid from socket reciver and save messages 

// check if client can accses the room it sends in
const controller = require('./controller');

exports.chat = async function chat(app, io) {
  //todo make checker so only the ones thats in it can accses it
  app.get("/chathistory", (req, res) => {

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
  io.on('connection', (socket) => {

    //get rooms 
    socket.on('chat message', (msg) => {
      //todo check for validity
      //broadcast to right room
      let samplejson = {
              
        id:"1",
        roomid:"1",
        userid:"2",
        text:msg,
        image:null
        }
      
      console.log('message: ' + msg);
      socket.broadcast.emit('msg', samplejson);
    });
  });
};
