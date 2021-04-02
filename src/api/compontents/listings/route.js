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
    app.post('/creatListing', upload.single('file'), async function (req, res) {
        req.body.creatProduct = JSON.parse(req.body.creatProduct)
        req.body.creatListing = JSON.parse(req.body.creatListing)
        if (typeof req.user === 'undefined') {
            console.log("creatListing user failed");
            res.status(400).json({ error: 'no user' });
            return
        }
        let verfef = await verifyer.verifyRef(req.user.refkey)
        if (typeof verfef === 'undefined') {
            console.log("creatListing ref failed");
            if (!verfef) {
                res.status(400).json({ error: 'invalid ref key' });
                return
            }
            
            res.status(400).json({ error: 'undefined key' });
        }
        if (typeof req.file === 'undefined') {
            console.log("creatListing file failed");
            res.status(400).json({ error: 'no file' });
            return
        }
        console.log(req.body.creatProduct)
        if (typeof req.body.creatProduct === 'undefined') {
            console.log("creatListing creatProduct failed");
            res.status(400).json({ error: 'product error' });
            return
        }
        if(!req.body.creatProduct[0]){
            console.log("creatListing creatProduct failed");
            res.status(400).json({ error: 'no product added' });
            return
        }
        if (typeof req.body.creatListing === 'undefined') {
            res.status(400).json({ error: 'failed to save' });
            return
        }
        const imagePath = path.join('./images');
        const fileUpload = new Resize(imagePath);
        if (!req.file) {
            res.status(400).json({ error: 'Please provide an image' });
            return
        }

        const filename = await fileUpload.save(req.file.buffer);
        if (await controller.creatListing(req.body.creatListing, req.user, req.body.creatProduct, await filename)) {
            //lazy update all listings to search
            res.status(200).json({ error: 'Created' });
            return
        }
        else{
            res.status(400).json({ error: 'failed to save' });
        }
    });
    app.get("/allListings", async function (req, res) {
        if (typeof req.user === 'undefined') {
            console.log("allListings failed verify user")
            res.status(400).json({ error: 'no user' });
            return
        }
        let resjson = await controller.getAllListings()
        if(!resjson){
            console.log("allListings failed controller")
            res.status(400)
            return
        }
        res.status(200).json(resjson);

    });
    app.get("/getListing", async function (req, res) {
        if (typeof req.user === 'undefined') {
            console.log("getListing failed verify user")
            res.status(400).json({ error: 'no user' });
            return
        }
        let resjson = await controller.getListing(req.query.listingID)
        if(!resjson){
            console.log("getListing failed controller")
            res.status(400)
            return
        }
        res.status(200).json(resjson);
    });
    app.post('/addOrder', async function (req, res) {
        if (typeof req.user !== 'undefined') {
            if (!verifyer.veifyUser(req.user.name)) {
                console.log("addOrder failed verify user")
                res.status(400)
                return
            }
            if (controller.creatOrder(req.body, req.user)) {
                res.status(200)
            }
            console.log("addOrder failed controller");
            res.status(400)
        } else {
            console.log("addOrder failed user");
            res.status(400).json({
                authenticated: false,
            });
            return
        }
 
    });

    app.post("/searchListings", async function (req, res) {
        let a = req.body.search
        if(a<4){
            console.log("search failed <4");
            res.status(400)
            return
        }
        if (typeof req.user !== 'undefined') {
            let searchquary = req.body.search
            let resjson = await controller.getSearchTitleAndProduct(searchquary)
            if (resjson) {
                resjson = resjson.map(x => JSON.parse(x))
                res.status(200).json(resjson);
            } else {
                console.log("search failed controller");
                res.status(400)
            }
        }
        else{
            console.log("search failed user");
            res.status(400)
        }
    });
};
