const controller = require('./controller');
const verifyer = require('../../securityUtil')
exports.routes = async function route(app) {
    app.post('/creatListing', async function (req, res) {
        if (!verifyer.verifyRef(req.user.refkey)) {
            res.status(400)
            return
        }
        console.log("create listing");

        if (controller.creatListing(req.body.creatListing, req.user,req.body.creatProduct)) {
        }
        res.status(400)
    });
    app.get("/allListings", async function (req, res) {
        console.log("listing");
        let resjson = await controller.getAllListings()
        //console.log(resjson);
        res.status(200).json(resjson);
    });
    app.post('/addOrder', async function (req, res) {
        //get seller and price from poductmodel and get userid from req.userid
        if (verifyer.veifyUser(req.user.name)) {
            res.status(400)
            return
        }
        console.log("create listing");
        if (controller.creatOrder(req.body)) {
            res.status(200)
        }
        res.status(400)
    });
};