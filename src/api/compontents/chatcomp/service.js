
const models = require('../../../../db/models');
const messages = models.messages;
const userModel = models.userModel;
const inRoom = models.inRoom;
const orders = models.orders;
const products = models.products
const prodInOrder = models.prodInOrder
const reviews = models.reviews;

exports.insertReview = async function (rating,text,sellerid,orderid) {

    const review = reviews.build({ sellerid: sellerid});
    review.text = text;
    review.rating = rating;
    review.orderid = orderid;
    await review.save();
    return await review

};

exports.updateOrderState = async function (param) {

    const user = await orders.update({ orderstate: param.orderstate }, {
        where: {
            id: param.id
        }
    });
    return user;
}

exports.updateReview = async function (param) {
    const user = await userModel.update({
        rating: param.rating,
        ratingNr: param.ratingNr
    }, {
        where: {
            id: param.id
        }
    });
    return user;
}
exports.getAllMsgInRoom = async function (roomIdParam) {
    const msg = await messages.findAll({
        where: { roomid: roomIdParam }
    });
    return msg;
};
exports.getRoomWhereOrderID = async function (idParam) {

    const chatRoom = await orders.findOne({
        where: {
            id: idParam
        }
    });
    return chatRoom;
}
exports.getSellerroom = async function (idParam) {
    const chatRoom = await inRoom.findOne({
        where: {
            sellerid: idParam
        }
    });
    return chatRoom;
}
exports.getRawUserId = async function (idParam) {
    const user = await userModel.findOne({ where: { id: idParam } });
    return user;
};
exports.saveMessage = async function (objct) {
    return await messages.create({
        roomid: objct.roomid,
        userid: objct.userid,
        text: objct.text,
        image: objct.image
    })
}
exports.getAllInRoomWhereRoomid = async function (roomIdParam) {
    const room = await inRoom.findAll({
        where: { roomid: roomIdParam }
    });
    return room;
};
exports.getAllRoomsWhereUserId = async function (userid) {
    const room = await inRoom.findAll({
        where: { userid: userid }
    });
    return room;
};
exports.getAllRoomsWhereSellerId = async function (userid) {

    const room = await inRoom.findAll({
        where: { sellerid: userid }
    });
    return room;
};
exports.getOrderWhereOrderID = async function (orderid) {
    const room = await orders.findOne({
        where: { id: orderid }
    });
    return room;
};
exports.getOrderWhereRoomID = async function (roomIdParam) {
    const room = await orders.findOne({
        where: { roomid: roomIdParam }
    });
    return room;
};
exports.getproduct = async function (productid) {
    const product = await products.findOne({
        where: { id: productid }
    });
    return product;
};

exports.getProductsInOrder = async function (orderid) {
    const order = await prodInOrder.findAll({
        where: { orderid: orderid }
    });
    return order;
};

