const models = require('../../../../db/models');
const userModel = models.userModel;
const inRoom = models.inRoom;
const orders = models.orders;
const products = models.products;
const listings = models.listings;
const inListing = models.inListing;
const prodInOrder = models.prodInOrder;

exports.getRawUserId = async function (idParam) {
    const user = await userModel.findOne({ where: { id: idParam } });
    return user;
};
exports.getAllListing = async function () {
    const returnvar = await listings.findAll({ limit: 100, order: [['updatedAt', 'DESC']] });
    return returnvar;
};

exports.getProduct = async function (param) {
    const returnvar = await products.findOne({ where: { id: param } });
    return returnvar;
};

//to get products and prices for listing
exports.getProdcutsInListing = async function (param) {
    const returnvar = await inListing.findAll({ where: { listingid: param } });
    return returnvar;
}
exports.creatInListing = async function (pID, lID) {
    const list = await inListing.create({
        productid: pID, listingid: lID
    });
    return list
}
exports.creatListing = async function (insertobject) {
    //add inListing
    //add listings
    const list = await listings.create({
        name: insertobject.name, sellerid: insertobject.sellerid, text: insertobject.text, image: insertobject.image
    });
    return list;
};
exports.creatProduct = async function (prod) {
    const product = await products.create({
        sellerid: prod.sID, name: prod.name, price: prod.price, image: prod.image
    });
    return product
}
exports.creatOrder = async function (order) {
    const returnorder = await orders.create({
        roomid: order.roomid, userid: order.userid, sellerid: order.sellerid,
        productid: order.productid, quant: order.quant
    });
    return returnorder
}

//unused when redis cachce
exports.getListingFromId = async function (param) {
    const returnvar = await listings.findOne({ where: { id: param } })
    return returnvar;
}
exports.addProductInOrder = async function (order) {
    const returnorder = await prodInOrder.create({
        orderid: order.orderid, productid: order.productid, quant:order.quant
    });
    return returnorder
}

exports.addInRoom= async function (param) {
    const returnorder = await inRoom.create({
        roomid:param.roomid,sellerid:param.sellerid,userid:param.userid,orderid:param.orderid
    });
    return returnorder
}
exports.updateUser = async function (idParam) {
    const user = await userModel.update({ btc: idParam.btc }, {
        where: {
            id: idParam.id
        }
    });
    return user;
}

// roomid:prod.roomid,userid:prod.userid,sellerid:prod.sellerid,productid:prod.productid,quant:prod.quant