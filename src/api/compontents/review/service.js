const models = require('../../../../db/models');
const userModel = models.userModel;
const reviews = models.reviews;
const disputes = models.disputes;
exports.getRawUserId = async function (idParam) {
    const user = await userModel.findOne({ where: { id: idParam } });
    return user;
};
exports.getRawUserNick = async function (nickParam) {
    const user = await userModel.findOne({ where: { nick: nickParam } });
    return user;
};
exports.getReviews = async function (idParam) {
    const review = await reviews.findAll({ where: { sellerid: idParam } });
    return review;
};

exports.getDisputes = async function (idParam) {
    const dispute = await disputes.findOne({ where: { orderid: idParam } });
    return dispute;
};
exports.createDisputes = async function (orderid,text) {
    const dispute = disputes.build({ orderid: orderid});
    dispute.text = text;
    await dispute.save();
    return await dispute
};