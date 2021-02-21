const service = require('./service');
const { v4: uuidv4 } = require('uuid');
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
exports.creatListing = async function (insertobject) {
    //verify seller
    //service.creatInListing() 
    let a = await service.creatListing(insertobject)
    console.log("finished listing");
    let prodarra = insertobject.products
    prodarra.forEach(element => {
        console.log(element + " " + a.id);
        service.creatInListing(element, a.id)
    });
};
exports.creatProduct = async function (prod, senderID) {

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
    let send = {userid:userid,roomid:chatroom,sellerid:product.sellerid}
    service.addInRoom(send)
}