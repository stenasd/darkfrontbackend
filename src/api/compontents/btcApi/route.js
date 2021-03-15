const controller = require('./controller');
const verifyer = require('../../securityUtil')
var CronJob = require('cron').CronJob;
exports.routes = async function route(app) {
    var job = new CronJob('*/2 * * * *', function () {
        controller.sync()
    }, null, true, 'America/Los_Angeles');
    job.start();
    //get adress for client 
    app.get("/creatAdress", async function (req, res) {
        if (req.user) {
            let adrr = await controller.getnewadress(req.user.id)
            if (adrr) {
                console.log("todo insert res here")
            }
        }
        else {
            console.log("no user")
        }
    });
    app.get("/getCurrentAdress", async function (req, res) {
        if (req.user) {
            let adrr = await controller.getnewadress(req.user.id)
            if (adrr) {
                console.log("todo insert res here")
            }
        }
        else {
            console.log("no user")
        }
    });

};