//api routs for chat history

//user got a socket thats saved and backend keeps track on all messages and send it to correct

//get roomid and and userid from socket reciver and save messages 

// check if client can accses the room it sends in
const controller = require('./controller');
const verifyer = require('../../securityUtil')
const path = require('path');
const Resize = require('../resize');
const multer = require('multer');
const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});
exports.routes = async function route(app) {
    //updates redis db with all listings
    controller.updateRedis();
    app.post('/creatListing', upload.single('file'), async function(req, res) {
        req.body.creatProduct = JSON.parse(req.body.creatProduct)
        req.body.creatListing = JSON.parse(req.body.creatListing)
        if (!req.user) {
            res.status(400).json({ error: 'no user' });
            return
        }
        if (!verifyer.verifyRef(req.user.refkey)) {
            res.status(400).json({ error: 'invalid ref key' });
            return
        }
        if (!req.file) {
            res.status(400).json({ error: 'no file' });
            return
        }

        if (!req.body.creatProduct) {
            res.status(400)
            return
        }
        if (!req.body.creatListing) {
            res.status(400)
            return
        }
        const imagePath = path.join('./images');
        const fileUpload = new Resize(imagePath);
        if (!req.file) {
            res.status(400).json({ error: 'Please provide an image' });
        }

        const filename = await fileUpload.save(req.file.buffer);
        console.log(req.body.creatListing)
        if (controller.creatListing(req.body.creatListing, req.user, req.body.creatProduct, await filename)) {
            //lazy update all listings to search
            res.status(200).json({ error: 'Created' });
        }
        res.status(400)
    });
    app.get("/allListings", async function(req, res) {
        let resjson = await controller.getAllListings()
        res.status(200).json(resjson);

    });
    app.get("/getListing", async function(req, res) {
        let resjson = await controller.getListing(req.query.listingID)
        res.status(200).json(resjson);
    });
    app.get("/", async function(req, res) {});
    app.post('/addOrder', async function(req, res) {
        if (!verifyer.veifyUser(req.user.name)) {
            res.status(400)
            return
        }
        if (controller.creatOrder(req.body, req.user)) {
            res.status(200)
        }
        res.status(400)
    });

    app.post("/searchListings", async function(req, res) {
        let searchquary = req.body.search
        let resjson = await controller.getSearchTitleAndProduct(searchquary)
        if (resjson) {
            resjson = resjson.map(x => JSON.parse(x))
            res.status(200).json(resjson);
        } else {
            res.status(400)
        }
    });
};