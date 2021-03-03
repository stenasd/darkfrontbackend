const service = require('./service');
const { v4: uuidv4 } = require('uuid');
exports.getAllListings = async function () {
    //return cheapest product price and name in sek and btc with image,sellernick
    let listing = await service.getAllListing()
    return Promise.all(listing.map(async function (param) {
        let a = await getproducts(param)
        let prices = a.map(x => x.price)
        let sellernick = service.getRawUserId(param.sellerid)
        prices = prices.sort(function (a, b) { return a - b });
        console.log(prices[0]);
        param.prices = prices[0]
        console.log(param)
        let returnparam = { id: param.id, name: param.name, priceBTC: prices[0], sellernick: sellernick.name, image: param.image, titel: param.name }
        return returnparam
    }))
}
exports.getSearchTitleAndProduct = async function () {
    //searches titles productname disc and text
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
exports.getListing = async function (id) {
    let listing = await service.getListingFromId(id)
    let a = await getproducts(listing)
    let sellernick = service.getRawUserId(listing.sellerid)
    let returnparam = { id: listing.id, text: listing.text, sellernick: sellernick.name, image: listing.image, titel: listing.name, products: a }
    return returnparam
}
exports.creatListing = async function (insertobject, user, productParam, imagePath) {
    //verify seller
    //service.creatInListing()
    console.log(imagePath)
    let data = { name: insertobject.titel, sellerid: user.id, image: imagePath, text: insertobject.text }
    let createdListing = await service.creatListing(data)
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

    let object = { sID: user.id, name: prod.name, price: prod.price, image: prod.image }
    return await service.creatProduct(object)
}

exports.creatOrder = async function (param, user) {
    let chatroom = uuidv4();
    let product = await service.getProduct(param[0].productid)

    let obj = {
        roomid: chatroom, userid: user.id, sellerid: product.sellerid
    }
    let returnOrder = await service.creatOrder(obj)
    console.log(returnOrder)
    let addinroom = await service.addInRoom({
        roomid: chatroom, sellerid: product.sellerid, userid: user.id,orderid:returnOrder.id
    })
    let addinroomSeller = await service.addInRoom({
        roomid: chatroom, sellerid: product.sellerid, userid: user.id,orderid:returnOrder.id
    })
    param.forEach(async (order) => {
        //adds addproductinorder tanble
        let prodInorder = {
            orderid: returnOrder.id, productid: order.productid, quant: order.quant
        }
        let a = await service.addProductInOrder(prodInorder)
    });

}

