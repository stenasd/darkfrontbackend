const service = require('./service');

exports.getAllListings = async function () {
    let listing =  await service.getAllListing()
    let list = listing.map(async function(param) {
        console.log("map param");
        console.log(param);
        let a = await getproducts(param)
        return a
    })
    return listing
}
async function getproducts(param){
    let products = await service.getProdcutsInListing(param.id)
    let prod = products.map(async function(param) {
        let prod = await service.getProduct(param.productid)
        return prod
    })
    return prod
}
exports.getproduct = async function (id) {
    return await service.getAllListing(id)
}
exports.creatListing = async function (insertobject) {
    console.log(insertobject)
    const user = await userModel.create({ name:insertobject.sellerid, pass:insertobject.pass,
    });
    return user;
};
