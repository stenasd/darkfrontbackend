const controller = require('./controller');
const verifyer = require('../../securityUtil')
const path = require('path');
const Resize = require('../resize');
const multer = require('multer');
const { stat } = require('fs');
const { log } = require('console');
const e = require('cors');
const upload = multer({
    limits: {
        fileSize: 4 * 1024 * 1024,
    }
});
//TODO combine sorder and k order
exports.chat = async function chat(app, io) {
    app.post("/addreview", async function(req, res) {
        if (typeof req.user === 'undefined') {
            console.log("addreview user failed");
            res.status(400)
            return
        }
        if (typeof req.body.orderid === 'undefined') {
            console.log("addreview orderid failed");
            res.status(400)
            return
        }
        if (isNaN(req.body.orderid)) {
            console.log("addreview orderid failed NaN");
            res.status(400)
            return
        }
        let state = await controller.checkOrderBuyer(req.body.orderid, req.user.id)
        if (state == 1) {
            let foo = { id: req.body.orderid, orderstate: 2 }
            let respon = await controller.updateState(foo)
            if (respon) {
                controller.updateReviews(req.body.orderid, req.body.rating, req.body.text)
                res.status(200)
            }
        }
        console.log("addreview controllerfail");
        res.status(400)
    });

    app.post("/orderSent", async function(req, res) {
        if (typeof req.user === 'undefined') {
            console.log("orderSent user failed");
            res.status(400)
            return
        }

        if (typeof req.body.orderid === 'undefined') {
            console.log("orderSent orderid failed");
            res.status(400)
            return
        }

        if (isNaN(req.body.orderid)) {
            console.log("orderSent orderid failed NaN");
            res.status(400)
            return
        }

        let state = await controller.checkOrderSeller(req.body.orderid, req.user.id)
        if (state == 0) {
            let respon = await controller.updateState({ id: req.body.orderid, orderstate: 1 })
            if (respon) {
                res.status(200)
            }
        }
        console.log("orderSent controller fail");
        res.status(400)
            //Updates order state to 1
            //req orderid and userid veify that is seller and can change tis orderid
    });

    app.get("/sordar", async function(req, res) {
        let getallroomns = await controller.getChatsSel(req.user.id)
        let index = 0;
        getallroomns.forEach(element => {
            Object.assign(getallroomns[index], { postadress: "/order/" + element.orderID })
            index++;
        });
        res.render('orders', { data: getallroomns })
    });
    app.get("/kordrar", async function(req, res) {
        let getallroomns = await controller.getChats(req.user.id)
        let index = 0;
        getallroomns.forEach(element => {
            Object.assign(getallroomns[index], { postadress: "/order/" + element.orderID })
            index++;
        });
        res.render('orders', { data: getallroomns })
    });
    app.get("/order/:tagId", async function(req, res) {
        if (typeof req.user === 'undefined') {
            console.log("orderSent user failed");
            res.status(400)
            return
        }
        if (await controller.checkOrderBuyer(req.params.tagId, req.user.id) >= 0 ||
            await controller.checkOrderSeller(req.params.tagId, req.user.id) >= 0) {
            let getallroomns = await controller.getOrder(req.params.tagId, req.user.id)
            if (getallroomns.orderstate == 0) {
                Object.assign(getallroomns, { a0: true })
            }
            if (getallroomns.orderstate == 1) {
                Object.assign(getallroomns, { a1: true })
            }
            if (getallroomns.orderstate == 2) {
                Object.assign(getallroomns, { a2: true })
            }
            Object.assign(getallroomns, { postadress: "/order/" + req.params.tagId })
            res.render("order", { data: getallroomns })
            return
        }
        res.status(400)
    });
    app.post('/order/:tagId', upload.single('file'), async function(req, res) {
        console.log(req.body);
        if (typeof req.user === 'undefined') {
            console.log("orderSent user failed");
            res.status(400)
            return
        }
        if (await controller.checkOrderBuyer(req.params.tagId, req.user.id) >= 0 ||
            await controller.checkOrderSeller(req.params.tagId, req.user.id) >= 0) {
            let filename
            if (req.file) {
                const imagePath = path.join('./images');
                const fileUpload = new Resize(imagePath);
                filename = await fileUpload.save(req.file.buffer);
                filename = "/" + filename
            }
            let chatroom = await controller.getRoomWhereOrderID(req.params.tagId)
            let savemessage = {
                text: req.body.text,
                image: await filename,
                name: req.user.nick,
                roomid: chatroom.roomid,
                userid: req.user.id
            }
            let a = await controller.saveMessage(savemessage)
            if (a) {
                res.redirect("/order/" + req.params.tagId)
            }
        }

    });
};