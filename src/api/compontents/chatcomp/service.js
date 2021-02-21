
const models = require('../../../../db/models');
const messages = models.messages;
const userModel = models.userModel;
const inRoom = models.inRoom;
const orders = models.orders;
const products = models.products

exports.getAllMsgInRoom = async function (roomIdParam) {
    const msg = await messages.findAll({
        where: { roomid: roomIdParam }
    });
    return msg;
};
exports.getChatroom = async function (idParam) {
    const chatRoom = await inRoom.findOne({
        where: {
            userid: idParam
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

