const models = require('../../../../db/models');
const transactions = models.transactions;
const usedAdresses = models.usedAdresses;
const userModel = models.userModel;
const TXID = models.ownedTXID;
exports.getRawUserId = async function (idParam) {
    const user = await userModel.findOne({ where: { id: idParam } });
    return user;
};

exports.updateUser = async function (idParam) {
    const user = await userModel.update({ btc: idParam.btc }, {
        where: {
            id: idParam.id
        }
    });
    return user;
}

exports.getTXIDWhereUSER = async function (param) {
    const returnvar = await TXID.findAll({ where: { userid: param } });
    return returnvar;
};
exports.addTXID = async function (insertobject) {
    const txid = await TXID.create({
        TXID: insertobject.txid, userid: insertobject.userid
    });
    return txid;
};

exports.addTransactions = async function (param) {
    const returnvar = await transactions.create({
        txid: param.txid, adress: param.adress, amount: param.amount, type: param.type
    });
    return returnvar;
};

exports.addUsedAdress = async function (insertobject) {
    const usedadresses = await usedAdresses.create({
        adress: insertobject.adress, userid: insertobject.userid
    });
    return usedadresses;
};
exports.getUsedAdress = async function (param) {
    const adress = await usedAdresses.findOne({ where: { adress: param } });
    return adress;
};
exports.getTXID = async function (param) {
    const adress = await transactions.findOne({ where: { txid: param } });
    return adress;
};
exports.getUsedAdressWhereID = async function (id) {
    const adress = await usedAdresses.findOne({
        where: { userid: id },
        order: [['createdAt', 'DESC']],
    });
    return adress;
};
