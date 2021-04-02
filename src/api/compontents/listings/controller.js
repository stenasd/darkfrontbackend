const service = require('./service');
const { v4: uuidv4 } = require('uuid');
const util = require('util');
const redis = require("redis");
const Search = require("redis-search")
const client = redis.createClient();
client.get = util.promisify(client.get);
var search = Search.createSearch();
search.query = util.promisify(search.query)

exports.getAllListings = async function() {
    //return cheapest product price and name in sek and btc with image,sellernick
    let listing = await service.getAllListing()
    return Promise.all(listing.map(async function(param) {
        let a = await getproducts(param)
        let prices = a.map(x => x.price)
        let sellernick = service.getRawUserId(param.sellerid)
        prices = prices.sort(function(a, b) { return a - b });
        param.prices = prices[0]
        let returnparam = { id: param.id, name: param.name, priceBTC: prices[0], sellernick: sellernick.name, image: param.image, titel: param.name, products: a, text: param.text }
        return returnparam
    }))
}
exports.updateRedis = async function() {
    return await updateCache();
}
async function updateCache() {
    console.log("updateing cache")
    let listing = await service.getAllListing()
    return Promise.all(listing.map(async function(param) {
        let a = await getproducts(param)
        let prices = a.map(x => x.price)
        let sellernick = await service.getRawUserId(param.sellerid)
        prices = prices.sort(function(a, b) { return a - b });
        param.prices = prices[0]
        let returnparam = { id: param.id, name: param.name, priceBTC: prices[0], sellernick: sellernick.name, image: param.image, titel: param.name, products: a, text: param.text }
        let productSearch = a.map(x => x.name + " ")
            //saves to search and db redis
        let searchsave = returnparam.name + " " + returnparam.sellernick + " " + returnparam.titel + " " + productSearch.toString()
        search.index(searchsave.replace(/\W+/g, " "), returnparam.id);
        client.set(returnparam.id, JSON.stringify(returnparam));
        return returnparam
    }))
}
exports.getSearchTitleAndProduct = async function(param) {
    let searchres = await search.query(param)
        //searches titles productname disc and text
    return Promise.all(searchres.map(async function(param) {
        return await client.get(param)
    }))
}
async function getproducts(param) {
    let products = await service.getProdcutsInListing(param.id)
    return Promise.all(products.map(async function(param) {
        let prod = await service.getProduct(param.productid)
        return prod
    }))
}

exports.getListing = async function(id) {
    /*
     BEFORE REDIS
     let listing = await service.getListingFromId(id)
     let a = await getproducts(listing)
     let sellernick = service.getRawUserId(listing.sellerid)
     let returnparam = { id: listing.id, text: listing.text, sellernick: sellernick.name, image: listing.image, titel: listing.name, products: a }
     return returnparam*/
    let listing = await client.get(id)
    listing = JSON.parse(listing)
    return await listing
}
exports.creatListing = async function(insertobject, user, productParam, imagePath) {

    //verify seller
    //service.creatInListing()
    let data = { name: insertobject.titel, sellerid: user.id, image: imagePath, text: insertobject.text }

    let nameLenght =  checkLenghtName(data.name)
    let textLenght =  checkLenghtText(data.text)
    let produktLenght = false
    productParam.forEach(prod => {
        if(prod.price>1000000)
        {
            console.log("failed creatListing toHighNumber");
            produktLenght = true
        }
    });

    if (await nameLenght||await textLenght||await produktLenght) {
        console.log("failed creatListing controller");
        return false
    }

    
    let createdListing = await service.creatListing(data)
    if (!createdListing) { return false }
    const prodarra = await Promise.all(productParam.map(async(prod) => {
        let object = { sID: user.id, name: prod.text, price: prod.price }
        return await service.creatProduct(object)
    }));
    prodarra.forEach(prod => {
        service.creatInListing(prod.id, createdListing.id)
    });

    await updateCache();
    return true
};
exports.creatOrder = async function(param, user) {
    let chatroom = uuidv4();
    let product = await service.getProduct(param[0].productid)
    let obj = {
        roomid: chatroom,
        userid: user.id,
        sellerid: product.sellerid
    }
    let returnOrder = await service.creatOrder(obj)
    let addinroom = await service.addInRoom({
        roomid: chatroom,
        sellerid: product.sellerid,
        userid: user.id,
        orderid: returnOrder.id
    })
    let orderprice = 0
    param.forEach(async(product) => {
        //adds addproductinorder tanble
        let prodInorder = {
            orderid: returnOrder.id,
            productid: product.productid,
            quant: product.quant
        }
        let prodprice = await service.getProduct(product.productid)
        orderprice = orderprice + prodprice.price * product.quant
        let a = await service.addProductInOrder(prodInorder)
    });
    let usermoney = await service.getRawUserId(user.id)
    let btc = usermoney.btc - orderprice
    if (btc >= 0) {
        usermoney = { id: usermoney.id, btc: btc }
        service.updateUser(usermoney)
        return true;
    } else {
        return false
    }
}
async function checkLenghtName(param) {

    if(param.length<3){
        console.log("input validation Name failed Creatlisting controller")
        return true
    }
    if(param.length>19){
        console.log("input validation Name failed Creatlisting controller")
        return true
    }
    return false
}
async function checkLenghtText(param) {

    if(param.length>1000){
        console.log("input validation text failed Creatlisting controller")
        return true
    }
    return false
}
async function checkProduktLenght(param) {
    console.log(param.length)
    if(3>param.length){
        console.log("input validation Produkt failed Creatlisting controller")
        return true
    }
    if(param.length>60){
        console.log("input validation Produkt failed Creatlisting controller")
        return true
    }
    return false
}