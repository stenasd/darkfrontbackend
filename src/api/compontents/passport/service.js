const models = require('../../../../db/models');
const userModel = models.userModel;
//start()
exports.getRawUserId = async function (idParam) {
    const user = await userModel.findOne({ where: { id: idParam } });
    return user;
};
exports.getRawUserNick = async function (nickParam) {
    const user = await userModel.findOne({ where: { nick: nickParam } });
    return user;
};
exports.getRawUserName = async function (nameparam) {
    const user = await userModel.findOne({ where: { name: nameparam } });
    return user;
};
exports.creatUser = async function (insertobject) {
    console.log(insertobject)
    const user = await userModel.create({ name:insertobject.name, pass:insertobject.pass,
    refkey:insertobject.refer, nick:insertobject.nick });
    return user;
};
