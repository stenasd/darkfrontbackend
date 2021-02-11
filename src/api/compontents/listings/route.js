//api routs for chat history

//user got a socket thats saved and backend keeps track on all messages and send it to correct

//get roomid and and userid from socket reciver and save messages 

// check if client can accses the room it sends in
const controller = require('./controller');

exports.routes = async function route(app) {
    app.post('/creatlisting', async function (req, res) {
        if (controller.creatListing(req.data)) {
            res.status(200).json(signres);
        }
        res.status(400)
    });
    app.get("/allListings", async function (req, res){
        console.log("listing");
        let resjson = await controller.getAllListings()
        res.status(200).json(resjson);
    });

};


//create listing
//get listing
//get users listings with products solverd in controller products
//click to buy and it creates a room for seller and buyer and puts both inroom seller got seller as id