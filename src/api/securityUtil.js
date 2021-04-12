const models = require('../../db/models');
const userModel = models.userModel;
const ref = models.refkey
const sessionStore = models.sessionStore
const service = require('./compontents/chatcomp/service');
exports.veifyUser = async function (nameparam) {
    console.log("verf veifyUser");
    const user = await userModel.findOne({ where: { name: nameparam } });
    user.nick = "asdasddddd"
    //console.log(user.nick)
    //await user.save();
    if (user.id) {
        return true
    }
    return false
};
exports.verifyRef = async function (refer) {
    if (!refer) {
        console.log("verf Ref failed");
        return false
    }
    const refkey = await ref.findOne({ where: { referalcode: refer } });
    if (refkey) { return true }
    return false
};

exports.varifySess = async function (sessionId) {
    if (!sessionId) {
        return
    }
    console.log("verf sess");
    return await sessionStore.findOne({ where: { session_id: sessionId } });
};
exports.verifyInput = function (param, low, high) {
    let returnobject = {
        low: false,
        high: false,
        success: true
    }
    if (!param) returnobject.success = false;
    if (param.length > high) {
        returnobject.high = true;
        returnobject.success = false;
    }
    if (param.length < low){
        returnobject.low = true;
        returnobject.success = false;
    }
    return returnobject
}

exports.checkOrderBuyer = async function(orderid, userid) {
    if(!orderid)
    {
        return false
    }
    if(!userid)
    {
        return false
    }
    // return true if buyer can do buyer
    let order = await service.getRoomWhereOrderID(orderid);
    if (order.userid == userid) {
        console.log("TRUE");
        return order.orderstate
    }
    console.log("FALSE");
    return false
}
exports.checkOrderSeller = async function(orderid, userid) {
    if(!orderid)
    {
        return false
    }
    if(!userid)
    {
        return false
    }
    // return true if seller can do sell stuff
    let order = await service.getRoomWhereOrderID(orderid);
    if (order.sellerid == userid) {
        return order.orderstate
    }
    return false
}

//verfy in order
//verify seller and in order