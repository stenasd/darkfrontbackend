const service = require('./service');
const verifyer = require('../../securityUtil')

exports.updateState = async function(obj) {
    return await service.updateOrderState(obj)
}
exports.updateReviews = async function(orderid, rating,text) {
    let order = await service.getRoomWhereOrderID(orderid)
    let user = await service.getRawUserId(order.sellerid)
    if (rating > 5) {
        return false;
    }
    if (rating < 0){
        return false
    }
    if(!text){
        return false
    }
    let currentscore = user.rating
    let numberOfRatings = user.ratingNr
    //typecheck here
    if (numberOfRatings == 0) {
        currentscore = rating
        numberOfRatings = 1
    } else {
        let a = currentscore * numberOfRatings
        a = a + rating
        numberOfRatings++;
        currentscore = a / numberOfRatings
    }
    service.insertReview(rating,text,order.sellerid,orderid)
    return await service.updateReview({ rating: currentscore, ratingNr: numberOfRatings, id: user.id })
}


exports.getchatHistory = async function(id) {
    return await service.getAllMsgInRoom(id)
}

exports.getRoomWhereOrderID = async function(id) {
    return await service.getRoomWhereOrderID(id)
}
exports.getSellerRoom = async function(id) {
    return await service.getSellerroom(id)
}

exports.verifySender = async function(senderID, roomid) {
    let allinroom = await service.getAllInRoomWhereRoomid(roomid)
    let inroom = false
    allinroom.forEach(element => {
        if (element.userid == senderID) {
            inroom = true
        }
    });
    return inroom

}
exports.saveMessage = async function(obj) {
    return await service.saveMessage(obj)
}
exports.getOrderWhereRoomID = async function(roomid) {
    return await service.getOrderWhereRoomID(roomid)
}
exports.verifysession = async function(obj) {
    let a = await verifyer.varifySess(obj)
    let userid = JSON.parse(a.data)
    userid = userid.passport.user
    return await service.getRawUserId(userid)
}
exports.getAllRoomsWhereUserId = async function(obj) {
    return await service.getAllRoomsWhereUserId(obj)
}
exports.getOrder = async function(orderid, senderID) {
    console.log(orderid + " "+ senderID);
    let order = await service.getOrderWhereOrderID(orderid)
    let getProductsInOrder = await service.getProductsInOrder(orderid)
    let prodInOrder = await Promise.all(getProductsInOrder.map(async function(param) {
        let product = await service.getproduct(param.productid)
        return {
            productName: product.name,
            productPrice: product.price,
            quant: param.quant
        }
    }))
    let chathistory = await service.getAllMsgInRoom(order.roomid)
    let chatHistory = Promise.all(chathistory.map(async function(param1) {
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
    let buyer = await service.getRawUserId(order.userid)
    let isSeller = false
    if (senderID == order.sellerid) {
        isSeller = true
    }
    let returnobject = {
        products: await prodInOrder,
        messages: await chatHistory,
        orderID: order.id,
        seller: seller.nick,
        buyer: buyer.nick,
        isSeller: isSeller,
        orderstate: order.orderstate,
    }
    return returnobject
}
exports.getChats = async function(userid) {
    let allrooms = await service.getAllRoomsWhereUserId(userid)
    return await Promise.all(allrooms.map(async function(param) {
        let totalcost = 0
        let order = await service.getOrderWhereRoomID(param.roomid)
        let chathistory = await service.getAllMsgInRoom(param.roomid)
        let getProductsInOrder = await service.getProductsInOrder(order.id)
        let prodInOrder = await Promise.all(getProductsInOrder.map(async function(param) {
            let product = await service.getproduct(param.productid)
            totalcost = totalcost + param.quant * product.price;
            return {
                productName: product.name,
                productPrice: product.price,
                quant: param.quant
            }
        }))

        let chatHistory = Promise.all(chathistory.map(async function(param1) {
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
        let ordertitle = prodInOrder.map(data => {
            return data.productName + " QT: " + data.quant + " Pris: " + data.productPrice
        })
        if (order.orderstate) {
            order.orderstate = 0;
        }
        let returnobject = {
            products: await prodInOrder,
            messages: await chatHistory,
            orderID: order.id,
            seller: seller.nick,
            buyer: buyer.nick,
            orderstate: order.orderstate,
            title: ordertitle

        }


        return returnobject
    }))
}
exports.getChatsSel = async function(userid) {

    let allrooms = await service.getAllRoomsWhereSellerId(userid)
    return await Promise.all(allrooms.map(async function(param) {
        let totalcost = 0
        let order = await service.getOrderWhereRoomID(param.roomid)
        let chathistory = await service.getAllMsgInRoom(param.roomid)
        let getProductsInOrder = await service.getProductsInOrder(order.id)
        let prodInOrder = await Promise.all(getProductsInOrder.map(async function(param) {
            let product = await service.getproduct(param.productid)
            totalcost = totalcost + param.quant * product.price;
            return {
                productName: product.name,
                productPrice: product.price,
                quant: param.quant
            }
        }))

        let chatHistory = Promise.all(chathistory.map(async function(param1) {
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
        let ordertitle = prodInOrder.map(data => {
            return "Name: " + data.productName + " QT: " + data.quant + " Pris: " + data.productPrice
        })
        let returnobject = {
            products: await prodInOrder,
            messages: await chatHistory,
            orderID: order.id,
            seller: seller.nick,
            buyer: buyer.nick,
            title: ordertitle
        }
        if (userid == order.sellerid) { return returnobject }
        return false
    }))
}

exports.checkOrderBuyer = async function(orderid, userid) {
    if(!orderid)
    {
        return false
    }
    if(!userid)
    {
        return false
    }
    // return true if buyer can do buyer
    let order = await service.getRoomWhereOrderID(orderid);
    if (order.userid == userid) {
        console.log("TRUE");
        return order.orderstate
    }
    console.log("FALSE");
    return false
}
exports.checkOrderSeller = async function(orderid, userid) {
    if(!orderid)
    {
        return false
    }
    if(!userid)
    {
        return false
    }
    // return true if seller can do sell stuff
    let order = await service.getRoomWhereOrderID(orderid);
    if (order.sellerid == userid) {
        return order.orderstate
    }
    return false
}