//verify user
//verify seller
//verify creat accses
//use username for all verifcation
const models = require('../../db/models');
const userModel = models.userModel;
const ref = models.refkey
const sessionStore = models.sessionStore
exports.veifyUser = async function (nameparam) {
    const user = await userModel.findOne({ where: { name: nameparam } });
    if(user){ 
        return true}
    return false
};
exports.verifyRef = async function (refer) {
    const refkey = await ref.findOne({ where: { referalcode:refer } });
    if(refkey){return true}
    return false
};
exports.varifySess = async function (refer) {
    return await  sessionStore.findOne({ where: { session_id:refer } });
};
//verify sessionid