const controller = require('./controller');
var CronJob = require('cron').CronJob;
exports.routes = async function route(app) {
    /*
    app.get("/getReviews", async function (req, res) {
        if (typeof req.user === 'undefined') {
            console.log("getReviews user failed");
            res.status(400).json({ error: "invalid user" });
            return
        }
        if (req.user) {
            if (!req.body.sellerid) {
                res.status(400);
                return;
            }
            let respon = await controller.getReview(req.query.sellerid)
            if (respon) {
                res.status(200).json(respon);
            }
        } else {
            res.status(400).json({ error: "invalid user" });
        }
    });
    app.get("/user", async function (req, res) {
        console.log("asdasd");
        if (typeof req.user === 'undefined') {
            console.log("userPorfile user failed");
            res.status(400).json({ error: "invalid user" });
            return
        }
        if (req.user) {
            let respon = await controller.getUserProfile(req.query.nick)
            if (respon) {
                res.status(200).json(respon);
            }
        } else {
            res.status(400).json({ error: "invalid user" });
        }
    });*/
    app.get("/", async function (req, res) {
        if (typeof req.user === 'undefined') {
            res.render("home", { test: "asd" });
            return
        }
        if (req.user) {
            let respon = await controller.getUserProfile(req.user.nick)
            if (respon) {

                Object.assign(respon, { btc: 5 })
                res.render("profile", respon)
            }
        } else {
            res.render("home", { test: "asd" });
        }
    });

    app.get('/u/:tagId', async function (req, res) {
        if (!req.params.tagId) {
            return
        }
        if (typeof req.user === 'undefined') {
            res.render("home", { test: "asd" });
            return
        }
        if (req.user) {
            let respon = await controller.getUserProfile(req.params.tagId)
            if (respon) {

                res.render("profile", respon)
            }
        } else {
            res.render("home", { test: "asd" });
        }
    });

    app.post("/createDispute", async function (req, res) {
        if (typeof req.user === 'undefined') {
            res.status(400);
        }
        if (req.user) {
            if (req.body.orderid >= 0 && req.body.text) {
                controller.creatDispute(req.body.orderid, req.user.id, req.body.text)
                res.status(200);
                return;
            }
            res.status(400);
            return;
        }
    });
}