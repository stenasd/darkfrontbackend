const service = require('./service');
const { v4: uuidv4 } = require('uuid');
const { products } = require('../../../../db/models');
exports.getAllListings = async function () {
    let listing = await service.getAllListing()
    return Promise.all(listing.map(async function (param) {
        let a = await getproducts(param)
        console.log(param);
        console.log(a);
        return { data: [param, a] }
    }))
}
async function getproducts(param) {
    let products = await service.getProdcutsInListing(param.id)
    return Promise.all(products.map(async function (param) {
        console.log("poduct");
        let prod = await service.getProduct(param.productid)
        return prod
    }))
}
exports.getproduct = async function (id) {
    return await service.getProduct(id)
}
exports.creatListing = async function (insertobject, user, productParam) {
    //verify seller
    //service.creatInListing() 

    let data = { name: insertobject.titel, sellerid: user.id, price: insertobject.price, image: insertobject.image ,text:insertobject.text}
    let createdListing = await service.creatListing(data)
    console.log(createdListing)
    if (!createdListing) { return false }
    console.log(productParam)
    const prodarra = await Promise.all(productParam.map(async (prod) => {
        let object = { sID: user.id, name: prod.text, price: prod.price }
        return await service.creatProduct(object)
    }));
    prodarra.forEach(prod => {
        service.creatInListing(prod.id, createdListing.id)
    });
    console.log("finished listing");
    return true

};
exports.creatProduct = async function (prod, user) {

    let object = { sID: 1, name: prod.name, price: prod.price, image: prod.image }
    return await service.creatProduct(object)
}

exports.creatOrder = async function (order) {
    let userid = 1
    //verify seller
    //add buyer and seller to order chatroom
    let chatroom = uuidv4();
    let product = await service.getProduct(order.productid)
    let obj = {
        roomid: chatroom, userid: userid, sellerid: product.sellerid,
        productid: order.productid, quant: order.quant
    }

    service.creatOrder(obj)
    let send = { userid: userid, roomid: chatroom, sellerid: product.sellerid }
    service.addInRoom(send)
}