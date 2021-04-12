const service = require('./service');
const verifyer = require('../../securityUtil')
exports.getReview = async function (sellerid) {
    let searchres = await service.getReviews(sellerid)
    return Promise.all(searchres.map(async function (param) {
        let returnobject = {
            text: param.text,
            rating: param.rating
        }
        return await returnobject
    }))
}
exports.creatDispute = async function (orderid, userid, text) {
    if (await verifyer.checkOrderBuyer(orderid, userid) >= 0) {
        let verf = verifyer.verifyInput(text, 0, 2000)
        if (verf.success) {
            return await service.createDisputes(orderid, text)
        }
        console.log("verf failed creat dispute");
    }
    return false;
}
exports.getUserProfile = async function (param) {
    let user = await service.getRawUserNick(param)
    let reviewRes = await service.getReviews(user.id)
    let reviews = await Promise.all(reviewRes.map(async function (param) {
        let returnobject = {
            text: param.text,
            rating: param.rating
        }
        return await returnobject
    }))
    let returnobject = {
        wonDisputes:user.wonDisputes,
        lostDisputes:user.lostDisputes,
        disc:user.disc,
        rating:user.rating,
        ratingNr:user.ratingNr,
        nick:user.nick,
        reviews:reviews
    }
    return await returnobject
}