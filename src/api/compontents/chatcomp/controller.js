const service = require('./service');

exports.getchatHistory = async function (id) {
    return await service.getAllMsgInRoom(id)
}

exports.getChatRoom = async function (id) {
    return await service.getChatroom(id)
}
exports.saveMessage = async function(obj){
    return await service.saveMessage(obj)
}
exports.verifySender = async function(senderID,roomid){
    let allinroom = await service.getAllInRoomWhereRoomid(roomid)  
    let inroom = false 
    allinroom.forEach(element => {
        if(element.userid==senderID){
            inroom=true
        }
    });
    return inroom
}