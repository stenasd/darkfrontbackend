const models = require('../../../../db/models');

const chatRoom = models.chatRoom;
const orders = models.orders;
const products = models.products;
const listings = models.listings;
const inListing = models.inListing;

exports.getAllListing = async function () {
    const returnvar = await listings.findAll();
    return returnvar;
};

exports.getProduct = async function (param) {
    const returnvar = await products.findOne({ where: { id: param } });
    return returnvar;
};

//get orders for orderhistory and return to chat
exports.getOrdersWhereUserId = async function (param) {
    const returnvar = await orders.findAll({ where: { id: param } });
    return returnvar;
};

//to get products and prices for listing
exports.getProdcutsInListing = async function (param) {
    const returnvar = await inListing.findAll({ where: { id: param } });
    return returnvar;
}
exports.creatListing = async function (insertobject) {
    console.log(insertobject)
    const user = await userModel.create({
        name: insertobject.name, price: insertobject.price, sellerid: insertobject.sellerid, refkey: insertobject.refer, nick: insertobject.nick
    });
    return user;
};
