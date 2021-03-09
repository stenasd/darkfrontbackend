//api routs for chat history

//user got a socket thats saved and backend keeps track on all messages and send it to correct

//get roomid and and userid from socket reciver and save messages 

// check if client can accses the room it sends in
const controller = require('./controller');
const verifyer = require('../../securityUtil')
const path = require('path');
const Resize = require('./Resize');
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});
exports.routes = async function route(app) {
    app.post('/creatListing', upload.single('file'), async function (req, res) {
        if (!verifyer.verifyRef(req.user.refkey)) {
            res.status(400).json({ error: 'invalid ref key' });
            return
        }
        const imagePath = path.join('./images');
        const fileUpload = new Resize(imagePath);
        if (!req.file) {
            console.log("image upload error")
            res.status(400).json({ error: 'Please provide an image' });
        }
        console.log("image upload")
        const filename = await fileUpload.save(req.file.buffer);
        console.log(filename)
        if (controller.creatListing(JSON.parse(req.body.creatListing), req.user, JSON.parse(req.body.creatProduct), await filename)) {
            res.status(200).json({ error: 'Created' });
        }
        res.status(200)
    });
    app.get("/allListings", async function (req, res) {
        console.log("listing");
        let resjson = await controller.getAllListings()
        //console.log(resjson);
        res.status(200).json(resjson);
    });
    app.get("/getListing", async function (req, res) {
        let resjson = await controller.getListing(req.query.listingID)
        res.status(200).json(resjson);
    });
    app.post('/addOrder', async function (req, res) {
        console.log(req.user)
        if (!verifyer.veifyUser(req.user.name)) {
            console.log(verifyer.veifyUser(req.user.name));
            res.status(400)
            return
        }
        console.log("create listing");
        if (controller.creatOrder(req.body, req.user)) {
            res.status(200)
        }
        res.status(400)
    });
};

//listing {"sendobject":{"creatProduct":[{"text":"555","price":"666"},{"text":"555","price":"666"},{"text":"555","price":"666"},{"text":"555","price":"666"},{"text":"555","price":"666"}],"creatListing":{"titel":"777","text":"888"}}}
//order {"productid":"1","quant":"2"}
//listing quarry {"name":"testname","text":"asdasd","sellerid":"1","products":[2,1]}
//product {"name":"testname","price":69,"image":"testimage"}
//order {"productid":"1","quant":"2"}