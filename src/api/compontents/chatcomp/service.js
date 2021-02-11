
const models = require('../../../../db/models');
const chatRoom = models.chatRoom;
const messages = models.messages;
const userModel = models.userModel;
const inRoom = models.inRoom;


exports.getAllMsgInRoom = async function (roomIdParam) {
    const msg = await messages.findAll({
        where: { roomid: roomIdParam }
    });
    return msg;
};
exports.getChatroom = async function (idParam) {
    const chatRoom = await chatRoom.findOne({
        where: {
            id: idParam
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
