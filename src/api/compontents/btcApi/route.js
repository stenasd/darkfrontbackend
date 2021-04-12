const controller = require('./controller');
const verifyer = require('../../securityUtil')
var CronJob = require('cron').CronJob;
exports.routes = async function route(app) {
    controller.sync()
    var job = new CronJob('*/2 * * * *', function() {
       controller.sync()
    }, null, true, 'America/Los_Angeles');
    job.start();
    //get adress for client 
    app.post("/creatAdress", async function(req, res) {
        console.log("no addr");
        if (req.user) {
            let adrr = await controller.creatnewadress(req.user.id)


            if (adrr) {

                res.status(200).json({ adrr: adrr, });
            }
        } else {
            console.log("no user")
        }
    });
    app.get("/balance", async function(req, res) {
        if (req.user) {
            let btc = await controller.getCurrentBalance(req.user.id)
            if (btc) {
                res.status(200).json({ btc: btc });
            }
        } else {
            console.log("no user")
        }
    });
    app.get("/getCurrentAdress", async function(req, res) {

        if (req.user) {
            let adrr = await controller.getCurrentAdress(req.user.id)
            if (adrr) {
                res.status(200).json({ adrr: adrr.adress });
            }
        } else {

        }
    });

};