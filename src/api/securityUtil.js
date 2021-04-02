const models = require('../../db/models');
const userModel = models.userModel;
const ref = models.refkey
const sessionStore = models.sessionStore
exports.veifyUser = async function (nameparam) {
    console.log("verf veifyUser");
    const user = await userModel.findOne({ where: { name: nameparam } });
  
    if(user.id){ 
        return true}
    return false
};
exports.verifyRef = async function (refer) {
    if(!refer){
        return false
    }
    console.log("verf Ref");
    const refkey = await ref.findOne({ where: { referalcode:refer } });
    if(refkey){return true}
    return false
};

exports.varifySess = async function (sessionId) {
    if(!sessionId){
        return
    }
    console.log("verf sess");
    return await  sessionStore.findOne({ where: { session_id:sessionId } });
};
