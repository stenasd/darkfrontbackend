//api routs for chat history

//user got a socket thats saved and backend keeps track on all messages and send it to correct

//get roomid and and userid from socket reciver and save messages 

// check if client can accses the room it sends in
const controller = require('./controller');

exports.routes = async function route(app) {
    app.post('/creatlisting', async function (req, res) {
        console.log("create listing");
        if (controller.creatListing(req.body)) {
            res.status(200)
        }
        res.status(400)
    });
    app.get("/allListings", async function (req, res){
        console.log("listing");
        let resjson = await controller.getAllListings()
        res.status(200).json(resjson);
    });
    app.post('/creatproduct', async function (req, res) {
        console.log("create listing");
        if (controller.creatProduct(req.body)) {
            res.status(200)
        }
        res.status(400)
    });
    app.post('/addOrder', async function (req, res) {
        //get seller and price from poductmodel and get userid from req.userid
        console.log("create listing");
        if (controller.creatOrder(req.body)) {
            res.status(200)
        }
        res.status(400)
    });
    
};


//create listing
//get listing
//get users listings with products solverd in controller products
//click to buy and it creates a room for seller and buyer and puts both inroom seller got seller as id


//listing quarry {"name":"testname","text":"asdasd","sellerid":"1","products":[2,1]}
//product {"name":"testname","price":69,"image":"testimage"}