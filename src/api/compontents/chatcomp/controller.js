const service = require('./service');
const verifyer = require('../../securityUtil')
exports.getchatHistory = async function (id) {
    return await service.getAllMsgInRoom(id)
}

exports.getRoomWhereOrderID = async function (id) {
    return await service.getRoomWhereOrderID(id)
}
exports.getSellerRoom = async function (id) {
    return await service.getSellerroom(id)
}
exports.saveMessage = async function (obj) {
    return await service.saveMessage(obj)
}
exports.verifySender = async function (senderID, roomid) {
    let allinroom = await service.getAllInRoomWhereRoomid(roomid)
    let inroom = false
    allinroom.forEach(element => {
        if (element.userid == senderID) {
            inroom = true
        }
    });
    return inroom

}
exports.saveMessage = async function (obj) {
    return await service.saveMessage(obj)
}
exports.getOrderWhereRoomID = async function (roomid) {
    return await service.getOrderWhereRoomID(obj)
}
exports.verifysession = async function (obj) {
    let a = await verifyer.varifySess(obj)
    let userid = JSON.parse(a.data)
    userid = userid.passport.user
    return await service.getRawUserId(userid)

}
exports.getAllRoomsWhereUserId = async function (obj) {
    return await service.getAllRoomsWhereUserId(obj)
}
exports.getChats = async function (userid) {
    let allrooms = await service.getAllRoomsWhereUserId(userid)
    return await Promise.all(allrooms.map(async function (param) {
        let totalcost = 0
        let order = await service.getOrderWhereRoomID(param.roomid)
        let chathistory = await service.getAllMsgInRoom(param.roomid)
        let getProductsInOrder = await service.getProductsInOrder(order.id)
        let prodInOrder = await Promise.all(getProductsInOrder.map(async function (param) {
            let product = await service.getproduct(param.productid)
            totalcost = totalcost + param.quant * product.price;
            return {
                productName: product.name,
                productPrice: product.price,
                quant: param.quant
            }
        }))

        let chatHistory = Promise.all(chathistory.map(async function (param1) {
            let user = await service.getRawUserId(param1.userid)
            let returnmessage = {
                text: param1.text,
                image: param1.image,
                name: user.nick,
                date: param1.createdAt
            }
            return returnmessage
        }))
        let seller = await service.getRawUserId(order.sellerid)
        let buyer = await service.getRawUserId(param.userid)
        let ordertitle = prodInOrder.map(data=>{
            return data.productName+" QT: "+data.quant+" Pris: "+data.productPrice
        })
        console.log(prodInOrder)
        let returnobject = {
            products: await prodInOrder,
            messages: await chatHistory,
            orderID: order.id,
            seller: seller.nick,
            buyer: buyer.nick,
            title:ordertitle
        }
        return returnobject
    }))
}
exports.getChatsSel = async function (userid) {
    let allrooms = await service.getAllRoomsWhereSellerId(userid)
    return await Promise.all(allrooms.map(async function (param) {
        let totalcost = 0
        let order = await service.getOrderWhereRoomID(param.roomid)
        let chathistory = await service.getAllMsgInRoom(param.roomid)
        let getProductsInOrder = await service.getProductsInOrder(order.id)
        let prodInOrder = await Promise.all(getProductsInOrder.map(async function (param) {
            let product = await service.getproduct(param.productid)
            totalcost = totalcost + param.quant * product.price;
            return {
                productName: product.name,
                productPrice: product.price,
                quant: param.quant
            }
        }))

        let chatHistory = Promise.all(chathistory.map(async function (param1) {
            let user = await service.getRawUserId(param1.userid)
            let returnmessage = {
                text: param1.text,
                image: param1.image,
                name: user.nick,
                date: param1.createdAt
            }
            return returnmessage
        }))
        let seller = await service.getRawUserId(order.sellerid)
        let buyer = await service.getRawUserId(param.userid)
        let ordertitle = prodInOrder.map(data=>{
            return data.productName+" QT: "+data.quant+" Pris: "+data.productPrice
        })
        console.log(prodInOrder)
        let returnobject = {
            products: await prodInOrder,
            messages: await chatHistory,
            orderID: order.id,
            seller: seller.nick,
            buyer: buyer.nick,
            title:ordertitle
        }
        return returnobject
    }))
}